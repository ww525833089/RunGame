// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

import utils from "./Utils";
import Ground from "./Ground";
import Star from "./Star";
import MyGlobal from "./MyGlobal";
import Player from "./Player";
import { config } from "./Config";


@ccclass
export default class GameManager extends cc.Component {

    @property(cc.Label)
    messagelbl: cc.Label = null;
    @property
    gameScore:number = 0;

    @property(cc.Label)
    levelTips: cc.Label = null;

    @property(cc.Node)
    player_root : cc.Node = null;

    @property
    cLastGroundNode: cc.Node = null;//当前最后一个地面
    // LIFE-CYCLE CALLBACKS:

    @property
    isCreatingGround : boolean = false;

    @property(cc.Prefab)
    groundPrefab: cc.Prefab = null;
    // 地面对象池
    public groundPool: cc.NodePool = new cc.NodePool()

    @property(cc.Prefab)
    starPrefab: cc.Prefab = null;
    // 星星对象池
    public starPool: cc.NodePool =new cc.NodePool();

    // 星星被吃掉效果对象池
    public popStarPool: cc.NodePool =new cc.NodePool();

    @property
    level_speed:number=100;
    passScore :number = 100;

    @property
    game_status = 'stop';

    @property
    level :number = 1;
    curr_levelConfig:{} = null;

    onLoad () {
        // 把当前管理类放到全局的
        MyGlobal.GameManager = this;
        this.playLevelTips();
        this.init();
    }

    playLevelTips(){
        this.curr_levelConfig =   config.level['level_'+(this.level>3?3:this.level)];
        this.level_speed = this.curr_levelConfig["level_speed"];
        this.passScore = this.curr_levelConfig["pass_score"];
        this.levelTips.node.x = -this.node.width;
        cc.tween(this.levelTips.node)
        .to(1, { x:0 })
        .start();

        this.schedule(function(){
            this.levelTips.string="第"+this.level+"关!";
            
            cc.tween(this.levelTips.node).to(1, { x: -this.node.width }).call(() => {
                this.game_status = 'run';
            } )
            .start();
        
        },3);
        
    }

    init(){
        //物理组件启用
        cc.director.getPhysicsManager().enabled = true;

        //碰撞组件启用
        let collidermanager:cc.CollisionManager = cc.director.getCollisionManager();
        collidermanager.enabled = true;
        // collidermanager.enabledDebugDraw = true;
        // collidermanager.enabledDrawBoundingBox = true;
        this.player_root.x = - this.node.x/2;

        this.player_root.getComponent(Player).init();

        this.beginCreateGround();
    }

    num:number = 0;
    beginCreateGround(){
        if(this.isCreatingGround) return;
        let ground :cc.Node = null;
        let ly = -this.node.height/2+100;
        let cX = Math.floor(this.cLastGroundNode==null? -this.node.width/2 :this.cLastGroundNode.x+this.cLastGroundNode.width);
        let num = 0;
        for (; cX < this.node.width*2; this.num++) {
            this.isCreatingGround = true;
            
            let space = utils.get_random(100,300);
            let y = ly + utils.get_random(-100,100);
            let w = utils.get_random(800,1200);
            
            if(y<-this.node.height/2+100 || y>this.node.height/2-100){ continue};

            cX += w/2;
            ground = utils.getPoolNode(this.groundPool, this.groundPrefab);
            ground.parent = this.node;
            ground.getComponent(Ground).init(cX,y,w,this.player_root);
            // this.schedule(function() {
                this.beginCreateStar(cX-w/2,y+100,cX+w/2);
            // }, 5);
            

            cX += (space+w/2);
            ly = y;
            this.cLastGroundNode = ground;

        }
        this.isCreatingGround=false;
    }

    beginCreateStar(sx:number,sy:number,ex:number){
        let width = ex-sx;
        let starNum = utils.get_random(-1,10);
        let y = utils.get_random(sy,sy+300);
        for (let index = 0; index < starNum; index++) {
            let star :cc.Node = utils.getPoolNode(this.starPool,this.starPrefab);
            let x = utils.get_random(0,width);
            star.parent = this.node;
            ex+=x;
            star.getComponent(Star).init(ex,y,this.player_root);
        }
        
    }

    isEnoghGround(){
        if(this.isCreatingGround||this.cLastGroundNode == null) return;
        if(this.cLastGroundNode.x+this.cLastGroundNode.width < this.node.width*2){
            this.beginCreateGround();
        }
    }

    update (dt) {
        this.isEnoghGround();
        if(this.gameScore>=this.passScore ){
            this.level ++;
            this.gameScore = 0;
            this.level_speed +=100;
            this.gameStop();
            this.playLevelTips();
        }
    }

    gainScore(starObj:cc.Node,popStar:cc.Node){
        utils.putPoolNode(starObj,this.starPool);
        this.gameScore++;
        this.messagelbl.string = this.gameScore+"";
    }


    gameOver(){
        cc.director.loadScene("gameOver");
    }

    gameStop(){
        this.game_status = "stop";
        //销毁所有的星星
    }
}
