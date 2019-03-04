"use strict";

define(function (require) {
    const Jo = require("jo");

    new Jo({
        parent: ".application",
        size: 64,
        fill: "rgba(255, 225, 255, .2)",
        onFocus(event){
            console.log(event);
        },
        onMove(event){
            console.log(event);
        },
        onBlur(event){
            console.log(event);
        }
    });
});
