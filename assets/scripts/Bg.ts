// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Player from "./Player";
import utils from "./Utils";
import MyGlobal from "./MyGlobal";

const {ccclass, property} = cc._decorator;


@ccclass
export default class Bg extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Node)
    bg1 : cc.Node = null;

    @property(cc.Node)
    bg2 : cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.height = this.bg1.height = this.bg2.height = this.node.parent.height;
        this.node.width = this.bg1.width = this.bg2.width = this.node.parent.width;
        this.bg2.x = this.node.parent.width*2/3;
    }

    start () {

    }

    update (dt) {
        let moveDetal = MyGlobal.GameManager.level_speed*dt*0.1;
        this.bg1.x -=moveDetal;
        this.bg2.x -=moveDetal;
        if(this.bg1.x<=-this.node.width){
            this.bg1.x = this.node.width;
        }
        if(this.bg2.x<=-this.node.width){
            this.bg2.x = this.node.width;
        }
    }
}
