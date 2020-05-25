// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import gemeManager from "./GameManager"

@ccclass
export default class Player extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Node)
    gameManager:cc.Node = null;

    @property(cc.Animation)
    anim : cc.Animation = null;

    @property()
    speed : number =  100;
    getSpeed():number{
        return this.speed;
    }
    setSpeed(speed:number):void{
        this.speed = speed;
    }

    maxSpeed:number = 600;
    minSpeed:number = -600;
    accel:number = 100;

    @property
    RigidBody:cc.RigidBody = null;

    @property
    playerNode:cc.Node = null;

    @property
    accelUp:number = 0;
    upDirection :number = 1;
    // LIFE-CYCLE CALLBACKS:

    @property
    jumpComboNum = 0;

    onLoad () {

    }

    init(){
        this.node.scaleX = -1;
        this.playerNode = this.node.children[0];
        this.anim = this.playerNode.getComponent(cc.Animation);
        this.playRun();
        this.RigidBody = this.getComponent(cc.RigidBody);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPressed, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyReleased, this);
    }

    // _touch(e: cc.Event.EventTouch): void {
    //     this.playJump();
    //     // let speed = this.getSpeed()+10;
    //     // this.setSpeed(speed);
    // }

    playRun(){
        this.anim.play("sheep_run");
    }

    onKeyPressed(event){
        let keyCode = event.keyCode;
        switch(keyCode) {
            //向左走
            case cc.macro.KEY.a:
                this.accelUp = -1;
                break;
            // 向右走
            case cc.macro.KEY.d:
                this.accelUp = 1;
                break;
            // 向上跳
            case cc.macro.KEY.j:
                if(this.jumpComboNum<2){
                    this.jumpComboNum +=1;
                    // console.log(this.jumpComboNum);
                    this.upDirection = 1;
                    this.on_player_jump(this.upDirection);
                }
                break;
        }
        
    }

    onKeyReleased (event) {
        let keyCode = event.keyCode;
        switch(keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.d:
                this.accelUp = 0;
                break;
        }
    }
    update(dt){
        if(this.node.y<= -this.node.parent.height/2){
            this.gameManager.getComponent(gemeManager).gameOver();
        }

        // 如果没有按下左键或者右键
        if (this.accelUp != 0) {
            this.on_player_walk();
        }

        //根据当前加速度方向每帧更新速度
        if (this.accelUp<0 &&this.speed>this.minSpeed) {
            this.speed -= this.accel;
        } else if (this.accelUp> 0&& this.speed<this.maxSpeed) {
            this.speed += this.accel;
        }

        if(this.node.x >= this.node.parent.width/2){
            this.node.x = this.node.parent.width/2;
        } else if (this.node.x <= - this.node.parent.width/2) {
            this.node.x = -this.node.parent.width/2;
        }
    }
    on_player_walk() {
 
        // 取得之前获得的刚体组件的线速度
        var v = this.RigidBody.linearVelocity;
        // 改变其x方向的速度
        v.x = this.speed;
        // 将改变后的线速度赋值回去
        this.RigidBody.linearVelocity = v;
        // 这里是为了改变人物的面部朝向
        // this.node.scaleX = dir;
    }

    on_player_jump(dir) {
 
        // 取得之前获得的刚体组件的线速度
        var v = this.RigidBody.linearVelocity;
        // 改变其x方向的速度
        v.y = 1000 * dir;
        // 将改变后的线速度赋值回去
        this.RigidBody.linearVelocity = v;
        // this.anim.play("sheep_jump");
    }

    onBeginContact(contact:cc.PhysicsContact, selfCollider:cc.PhysicsBoxCollider, otherCollider:cc.PhysicsBoxCollider) {
        if(otherCollider.node.name == 'ground')
        this.jumpComboNum = 0;
        // this.playRun();
    }

}
