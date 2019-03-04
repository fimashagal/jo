"use strict";



class Randy{
    static gen(){
        return "_" + btoa(`${Math.random() * Date.now()}`).replace(/=/g, "");
    }
}

class Typo {
    static typeOf(object = null){
        return Object.prototype.toString
            .call(object)
            .replace(/^\[object (.+)\]$/, '$1')
            .toLowerCase();
    }
    static isObject(object = null){
        return Typo.typeOf(object) === "object";
    }
    static isDef(object = null){
        return Typo.typeOf(object) !== "undefined" && Typo.typeOf(object) !== "null";
    }
    static isntDef(object = null){
        return !Typo.isDef(object);
    }
    static isString(object = null){
        return Typo.typeOf(object) === "string";
    }
    static isNumber(object = null){
        return Typo.typeOf(object) === "number" && !isNaN(object);
    }
    static isBoolean(object = null){
        return Typo.typeOf(object) === "boolean";
    }
    static isFn(object = null){
        return Typo.typeOf(object) === "function";
    }
    static isElement(object = null){
        let response;
        try {
            if(typeof object === "string") {
                object = document.querySelector(object);
            }
            response = /^(html)+(.)+(element)$|htmlelement|^(svg)+(.)+(element)$/gm.test(this.typeOf(object));
        } catch {
            response = false;
        }
        return response;
    }

}

const secret = Randy.gen();


class Jo {
    constructor(options = null){
        this.$ = {};
        this.states = {
            initialized: false,
            focused: false
        };
        this.volumes = {
            size: 64,
            fill: "rgba(255, 255, 255, .2)",
            inputPosition: {
                x: 0,
                y: 0
            },
            inputDistance: 0,
            inputAngle: -180,
            limitDistance: 0
        };
        this.callbacks = {
            onFocus: null,
            onMove: null,
            onBlur: null
        };
        return Typo.isDef(options) ? this.initialize(options) : this;
    }

    initialize(options = null){
        const {states, volumes} = this;
        if(!states.initialized){
            this._injectBaseCSS(secret)
                ._useOptions(options, secret);
            states.initialized = true;
            volumes.limitDistance = (volumes.size / 2) - (volumes.size / 3)
        }
        return this;
    }

    setSize(value){
        this.volumes.size = value;
        this.$.svg && this._resizeElement(secret);
        return this;
    }

    setFill(value){
        this.volumes.fill = value;
        this.$.svg && this._refillElement(secret);
        return this;
    }

    getSize(){
        return this.volumes.size;
    }

    getFill(){
        return this.volumes.fill;
    }

    isFocused(){
        return this.states.focused;
    }

    _injectBaseCSS(accessKey = ""){
        if(accessKey !== secret) {
            return this;
        }
        if(!Typo.isElement(".jo-styles")){
            document.body.insertAdjacentHTML("afterbegin", `
                <style>
                    .jo-input { will-change: auto; cursor: pointer; }
                    .jo-flow { transition: all .1s linear; }
                </style>
            `);
        }
        return this;
    }

    _useOptions(options = null, accessKey = ""){
        if(accessKey !== secret) {
            return this;
        }
        if(Typo.isObject(options) && Object.keys(options).length){
            const {$} = this;
            let {size, fill, parent, onFocus, onMove, onBlur} = options;
            if(Typo.isString(fill)){
                this.setFill(fill);
            }
            if(Typo.isNumber(size)){
                this.setSize(size);
            }
            if(Typo.isElement(parent)){
                if(Typo.isString(parent)){
                    parent = document.querySelector(parent);
                }
                if(!Typo.isElement($.svg)){
                    this._createElement({ parent }, secret);
                }
            }
            if(Typo.isFn(onFocus)){
                this.callbacks.onFocus = onFocus.bind(this);
            }
            if(Typo.isFn(onMove)){
                this.callbacks.onMove = onMove.bind(this);
            }
            if(Typo.isFn(onBlur)){
                this.callbacks.onBlur = onBlur.bind(this);
            }
        }
        return this;
    }

    _createElement(options = null, accessKey = ""){
        if(accessKey !== secret) {
            return this;
        }
        const {volumes} = this;
        const {size, fill} = volumes;
        const {parent} = options;
        const sids = {
            svgId: Randy.gen(),
            circleAreaId: Randy.gen(),
            circleInputId: Randy.gen(),
            maskId: Randy.gen()
        };
        parent.insertAdjacentHTML("afterbegin", `
            <svg class="jo" style="clip-path: url(#${sids.maskId});" width="${size}" height="${size}" id="${sids.svgId}" viewBox="0 0 ${size} ${size}">
                <clipPath id="${sids.maskId}">
                    <circle class="jo-area" id="${sids.circleAreaId}" r="${size/2}" cx="${size/2}" cy="${size/2}" fill="${fill}"/>
                </clipPath>
                <circle class="jo-area" id="${sids.circleAreaId}" r="${size/2}" cx="${size/2}" cy="${size/2}" fill="${fill}"/>
                <circle class="jo-input" id="${sids.circleInputId}" r="${size/3}" cx="${size/2}" cy="${size/2}" fill="${fill}"/>
            </svg>
        `);
        this.$.svg = document.getElementById(sids.svgId);
        this.$.circleArea = document.getElementById(sids.circleAreaId);
        this.$.circleInput = document.getElementById(sids.circleInputId);

        for(let el of [this.$.svg, this.$.circleArea, this.$.circleInput]){
            el.removeAttribute("id");
        }

        return this._follow(secret);
    }

    _resizeElement(accessKey = ""){
        if(accessKey !== secret){
            return this;
        }
        return this;
    }

    _refillElement(accessKey = ""){
        if(accessKey !== secret){
            return this;
        }
        return this;
    }

    _follow(accessKey = ""){
        if(accessKey !== secret){
            return this;
        }
        const {$, callbacks, volumes, states} = this;
        $.circleInput.onmousedown = this._follower.bind(this);
        window.addEventListener("mouseup",event => {
            const {target} = event;
            const condition = target.classList.contains("jo-input")
                                || (!/^jo-|\sjo-/.test(target.getAttribute("class")) && this.isFocused());
            if(condition){
                    Typo.isFn(callbacks.onBlur) && callbacks.onBlur({
                        type: "blur",
                        originEvent: event,
                        x: volumes.inputPosition.x,
                        y: volumes.inputPosition.y,
                        angle: volumes.inputAngle
                    });
            }
            states.focused = false;
            $.svg.onmousemove = null;
            this._rewindInputPosition(secret);

        });
        return this;
    }

    _follower(event){
        const {offsetX, offsetY} = event;
        const startPosition = {
            x: offsetX,
            y: offsetY
        };
        const {callbacks, volumes, states} = this;
        states.focused = true;
        Typo.isFn(callbacks.onFocus) && callbacks.onFocus({
            type: "focus",
            originEvent: event,
            x: volumes.inputPosition.x,
            y: volumes.inputPosition.y,
            angle: volumes.inputAngle
        });
        this.$.circleInput.classList.remove("jo-flow");
        this.$.svg.onmousemove = event => {
            const {offsetX, offsetY} = event;
            this._updateInputData({
                    x: offsetX - startPosition.x,
                    y: offsetY - startPosition.y
                }, secret)
                ._updateView(secret);
            Typo.isFn(callbacks.onMove) && callbacks.onMove({
                type: "move",
                originEvent: event,
                x: volumes.inputPosition.x,
                y: volumes.inputPosition.y,
                angle: volumes.inputAngle
            });
        };
    }

    _updateInputData(options = {}, accessKey = ""){
        if(accessKey !== secret){
            return this;
        }
        const {volumes} = this;

        for(let key of ["x", "y"]){
            volumes.inputPosition[key] = options[key];
        }
        volumes.inputDistance = Math.sqrt(Math.pow(options.x, 2) + Math.pow(options.y, 2));
        volumes.inputAngle = +(Math.atan2(-volumes.inputPosition.y, -volumes.inputPosition.x) * 180 / Math.PI).toFixed();

        return this;
    }

    _updateView(accessKey = ""){
        if(accessKey !== secret){
            return this;
        }
        const {volumes} = this;
        const {x, y} = volumes.inputPosition;
        this.$.circleInput.setAttribute("style", `transform: translate(${x}px, ${y}px)`);
        return this;
    }

    _rewindInputPosition (accessKey = ""){
        if(accessKey !== secret){
            return this;
        }
        this.$.circleInput.classList.add("jo-flow");
        this._updateInputData({
                x: 0,
                y: 0
            }, secret)
            ._updateView(secret);
        return this;
    }

}

if(Typo.isFn(define) && define.amd){
    define(function () {
        return Jo;
    });
}
