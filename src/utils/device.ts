export function isMobileOrTabletDevice(): boolean {
  // Use modern userAgentData if available (Chrome/Edge Android)
  const nav = navigator as any;
  if (nav.userAgentData && nav.userAgentData.mobile !== undefined) {
    return nav.userAgentData.mobile;
  }
  
  // Fallback to standard regex
  const regex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  if (regex.test(navigator.userAgent)) {
    return true;
  }

  // Fallback for tablets requesting desktop site
  return window.innerWidth < 1024;
}
