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
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property
    player :cc.Node = null;

    @property
    groundPool :cc.NodePool = null;

    init(x:number, y:number, w:number,player:cc.Node){
        let v2: cc.Vec2 = cc.v2(x, y);
        this.node.setPosition(v2);
        this.node.width = w;
        
        let thisrigidbody:cc.RigidBody = this.getComponent(cc.RigidBody);
        thisrigidbody.syncPosition(true);

        let thisCollider:cc.PhysicsBoxCollider = this.getComponent(cc.PhysicsBoxCollider);
        thisCollider.size.width = w;
        thisCollider.size.height = this.node.height;        
        thisCollider.apply();

        this.player = player;
    }

    update(dt){
        this.isDisappare();

        if(this.player!=null){
            let moveDetal = MyGlobal.GameManager.level_speed*dt;
            this.node.x -= moveDetal;
            
        }
    }

    isDisappare(){
        if(this.node.width+this.node.x< -this.node.width/2){
            utils.putPoolNode(this.node,MyGlobal.GameManager.groundPool);
        }
    }

}
