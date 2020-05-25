// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MyGlobal from "./MyGlobal";
import utils from "./Utils";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Star extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Prefab)
    popStar: cc.Prefab = null;

    @property
    player :cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    start () {

    }

    update (dt) {
        if(this.player!=null){
            let moveDetal = MyGlobal.GameManager.level_speed*dt;
            this.node.x -= moveDetal;

            if(this.node.x< -this.node.parent.width/2){            
                utils.putPoolNode(this.node, MyGlobal.GameManager.starPool);
            }
        }

        if(MyGlobal.GameManager.game_status == 'Stop'){
            utils.putPoolNode(this.node,MyGlobal.GameManager.starPool);
        }
    }

    init(x:number,y:number,player:cc.Node){
        let v2: cc.Vec2 = cc.v2(x, y);
        this.node.setPosition(v2);
        this.player = player;
    }

    onCollisionEnter(other:cc.Collider, self:cc.Collider) {
        //碰撞之后播放碰撞效果
        let popStar:cc.Node = utils.getPoolNode(MyGlobal.GameManager.popStarPool,this.popStar);
        
        popStar.setPosition(self.node.getPosition());
        popStar.parent = MyGlobal.GameManager.node;

        MyGlobal.GameManager.gainScore(this.node,popStar);
    }
}
