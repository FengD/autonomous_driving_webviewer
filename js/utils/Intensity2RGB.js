var Intensity2RGB = function () {
    this.intensity2rgb = function (intensity) {
        let RGB = [];
        // let Intensity_map = (intensity >> 8) & 0xff;
        let Intensity_map = intensity;
        RGB[0] = intensity * 20;
        RGB[1] = 0;
        RGB[2] = 0;

        // console.log("Intensity_map", Intensity_map);
        // if (Intensity_map <= 100) {
        //     if (Intensity_map <= 34) {
        //         // constant blue , + green
        //         let Green = (Intensity_map * 255 / 34); // map to 256 range
        //         RGB[0] = 0x0;
        //         RGB[1] = Green & 0xff;
        //         RGB[2] = 0xff;
        //     }
        //     else if (Intensity_map <= 67) {
        //         // constant green , -blue
        //         let Blue = (((67 - Intensity_map) * 255) / 33); // map to 256 range
        //         RGB[0] = 0x0;
        //         RGB[1] = 0xff;
        //         RGB[2] = Blue & 0xff;
        //     }
        //     else {
        //         // constant green , + red
        //         let Red = (((Intensity_map - 67) * 255) / 33); // map to 256 range
        //         RGB[0] = Red & 0xff;
        //         RGB[1] = 0xff;
        //         RGB[2] = 0x0;
        //
        //     }
        // }
        // else {
        //     // constant red , - green
        //     let Green = (((255 - Intensity_map) * 255) / (256 - 100)); // map to 256 range
        //     RGB[0] = 0xff;
        //     RGB[1] = Green & 0xff;
        //     RGB[2] = 0x0;
        // }
        return RGB;
    }
}
export { Intensity2RGB };
