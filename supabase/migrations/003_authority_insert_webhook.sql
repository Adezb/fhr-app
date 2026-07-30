-- Enable pg_net and vault extensions for secure asynchronous HTTP requests from Postgres triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;

-- Create function to dispatch webhook payload to Supabase Edge Function on authority INSERT
CREATE OR REPLACE FUNCTION public.notify_new_authority_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  edge_function_url TEXT := 'https://qfiqhwyrcfulqntwroqv.supabase.co/functions/v1/notify-new-authority';
  payload JSONB;
  webhook_secret TEXT;
  clean_secret TEXT;
  request_headers JSONB;
BEGIN
  -- Dynamically retrieve the decrypted webhook secret from vault without exposing it in code
  SELECT COALESCE(decrypted_secret, secret) INTO webhook_secret 
  FROM vault.decrypted_secrets 
  WHERE name IN ('DATABASE_WEBHOOK_SECRET', 'webhook_secret') 
  LIMIT 1;

  -- Strip any newlines or trailing whitespace that libcurl would reject in HTTP headers
  IF webhook_secret IS NOT NULL THEN
    clean_secret := regexp_replace(webhook_secret, '[\r\n\s]+', '', 'g');
  END IF;

  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', TG_TABLE_NAME,
    'schema', TG_TABLE_SCHEMA,
    'record', row_to_json(NEW)::jsonb
  );

  request_headers := jsonb_build_object(
    'Content-Type', 'application/json'
  );

  IF clean_secret IS NOT NULL AND clean_secret <> '' THEN
    request_headers := request_headers || jsonb_build_object('X-Webhook-Secret', clean_secret);
  END IF;

  PERFORM net.http_post(
    url := edge_function_url,
    body := payload,
    headers := request_headers
  );

  RETURN NEW;
END;
$$;

-- Create trigger on authorities table for INSERT actions only
DROP TRIGGER IF EXISTS on_authority_insert ON public.authorities;
CREATE TRIGGER on_authority_insert
  AFTER INSERT ON public.authorities
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_authority_webhook();
