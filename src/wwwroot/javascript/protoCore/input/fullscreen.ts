/**
 * @author Maxwell DeVos
 * Toggles fullscreen for a given element
 * @param { Object } element an element on the page
 * @api public
 */
export function toggleFullScreen(element: any) {
    if (!document.fullscreenElement) {
        // Supports most browsers and their versions.
        var requestMethod =
            element.requestFullScreen ||
            element.webkitRequestFullScreen ||
            element.mozRequestFullScreen ||
            element.msRequestFullScreen;

        if (requestMethod) {
            // Native full screen.
            requestMethod.call(element);
        } else {
            console.log("Please use a supported browser to use fullscreen.");
        }
    } else {
        document.exitFullscreen();
    }
}
