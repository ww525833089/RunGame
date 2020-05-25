// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MyGlobal from "./MyGlobal";
import Utils from "./Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.getComponent(cc.Animation).play("pop_star");
    }

    start () {

    }

    selfDestroy(){
        Utils.putPoolNode(this.node,MyGlobal.GameManager.popStarPool);
    }

    // update (dt) {}
}
