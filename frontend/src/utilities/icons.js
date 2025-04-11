//Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.

import leaflet from 'leaflet';
import {renderToString} from "react-dom/server";


function generateVehicleIcon(type, color) {
    const style = {stroke: "#202020", strokeWidth: 15, fill: color}
    let icon;
    switch (type) {
        case 0:
        case 1:
            icon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24" height="24"><path style={style} d="M96 0C43 0 0 43 0 96L0 352c0 48 35.2 87.7 81.1 94.9l-46 46C28.1 499.9 33.1 512 43 512l39.7 0c8.5 0 16.6-3.4 22.6-9.4L160 448l128 0 54.6 54.6c6 6 14.1 9.4 22.6 9.4l39.7 0c10 0 15-12.1 7.9-19.1l-46-46c46-7.1 81.1-46.9 81.1-94.9l0-256c0-53-43-96-96-96L96 0zM64 128c0-17.7 14.3-32 32-32l80 0c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32l-80 0c-17.7 0-32-14.3-32-32l0-96zM272 96l80 0c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32l-80 0c-17.7 0-32-14.3-32-32l0-96c0-17.7 14.3-32 32-32zM64 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm288-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>;
            break;
        case 2:
            icon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="24" height="24"><path style={style} d="M96 0C43 0 0 43 0 96L0 352c0 48 35.2 87.7 81.1 94.9l-46 46C28.1 499.9 33.1 512 43 512l39.7 0c8.5 0 16.6-3.4 22.6-9.4L160 448l128 0 54.6 54.6c6 6 14.1 9.4 22.6 9.4l39.7 0c10 0 15-12.1 7.9-19.1l-46-46c46-7.1 81.1-46.9 81.1-94.9l0-256c0-53-43-96-96-96L96 0zM64 96c0-17.7 14.3-32 32-32l256 0c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32L96 224c-17.7 0-32-14.3-32-32l0-96zM224 288a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>;
            break;
        case 3:
            icon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="24" height="24"><path style={style} d="M288 0C422.4 0 512 35.2 512 80l0 16 0 32c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32l0 160c0 17.7-14.3 32-32 32l0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32-192 0 0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32c-17.7 0-32-14.3-32-32l0-160c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32c0 0 0 0 0 0l0-32s0 0 0 0l0-16C64 35.2 153.6 0 288 0zM128 160l0 96c0 17.7 14.3 32 32 32l112 0 0-160-112 0c-17.7 0-32 14.3-32 32zM304 288l112 0c17.7 0 32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-112 0 0 160zM144 400a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm288 0a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM384 80c0-8.8-7.2-16-16-16L208 64c-8.8 0-16 7.2-16 16s7.2 16 16 16l160 0c8.8 0 16-7.2 16-16z"/></svg>;
            break;
        case 4:
            icon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="24" height="24"><path style={style} d="M224 0L352 0c17.7 0 32 14.3 32 32l75.1 0c20.6 0 31.6 24.3 18.1 39.8L456 96 120 96 98.8 71.8C85.3 56.3 96.3 32 116.9 32L192 32c0-17.7 14.3-32 32-32zM96 128l384 0c17.7 0 32 14.3 32 32l0 123.5c0 13.3-4.2 26.3-11.9 37.2l-51.4 71.9c-1.9 1.1-3.7 2.2-5.5 3.5c-15.5 10.7-34 18-51 19.9l-16.5 0c-17.1-1.8-35-9-50.8-19.9c-22.1-15.5-51.6-15.5-73.7 0c-14.8 10.2-32.5 18-50.6 19.9l-16.6 0c-17-1.8-35.6-9.2-51-19.9c-1.8-1.3-3.7-2.4-5.6-3.5L75.9 320.7C68.2 309.8 64 296.8 64 283.5L64 160c0-17.7 14.3-32 32-32zm32 64l0 96 320 0 0-96-320 0zM306.5 421.9C329 437.4 356.5 448 384 448c26.9 0 55.3-10.8 77.4-26.1c0 0 0 0 0 0c11.9-8.5 28.1-7.8 39.2 1.7c14.4 11.9 32.5 21 50.6 25.2c17.2 4 27.9 21.2 23.9 38.4s-21.2 27.9-38.4 23.9c-24.5-5.7-44.9-16.5-58.2-25C449.5 501.7 417 512 384 512c-31.9 0-60.6-9.9-80.4-18.9c-5.8-2.7-11.1-5.3-15.6-7.7c-4.5 2.4-9.7 5.1-15.6 7.7c-19.8 9-48.5 18.9-80.4 18.9c-33 0-65.5-10.3-94.5-25.8c-13.4 8.4-33.7 19.3-58.2 25c-17.2 4-34.4-6.7-38.4-23.9s6.7-34.4 23.9-38.4c18.1-4.2 36.2-13.3 50.6-25.2c11.1-9.4 27.3-10.1 39.2-1.7c0 0 0 0 0 0C136.7 437.2 165.1 448 192 448c27.5 0 55-10.6 77.5-26.1c11.1-7.9 25.9-7.9 37 0z"/></svg>;
            break;
        default:
            throw new Error("Invalid route type specified");
    }

    return leaflet.divIcon({className: "transparent-bg", iconAnchor: [12, 12], html: renderToString(icon)});
}

function generateHeadingIcon(heading, color) {
    const transform = "rotate(" + heading + ",24,24)";
    const style = {stroke: "#202020", strokeWidth: 0.7, fill: color};
    let icon = <svg width="48" height="48"><polygon points="24,0 28,10 20,10" style={style} transform={transform} /></svg>;
    return leaflet.divIcon({className: "transparent-bg", iconAnchor: [24, 24], html: renderToString(icon)});
}

export {generateVehicleIcon, generateHeadingIcon}