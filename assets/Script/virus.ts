// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class virus extends cc.Component {

    private anim = null;

    private jumpvelocity : number = 1000;

    private isDead: boolean = false;

    money: cc.Node = null;

    @property({ type: cc.AudioClip })
    StepEffect: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    BombEffect: cc.AudioClip = null;


    onLoad () {
        cc.director.getPhysicsManager().enabled = true;   
        this.anim = this.getComponent(cc.Animation);
        this.money = cc.find("Canvas/Main Camera/money");
    }

    start () {
        if(this.node.name == "virus_red1"){
            this.anim.play("virus_red1");
            this.virus_r1_move();
        }
        else if(this.node.name == "virus_red2"){
            this.node.parent.zIndex = 1;
            this.anim.play("virus_red2");
            this.virus_r2_move();
        }
    }

    //update (dt) {}

    private virus_r1_move(){
        let moveup = cc.moveBy(2, 0, 15);
        let movedown = cc.moveBy(2, 0, -15);
        this.node.runAction(cc.repeatForever(cc.sequence(moveup, movedown)));
    }

    private virus_r2_move(){
        let t1 = (480-this.node.parent.position.x)/192; // 192 = 960/5
        let t2 = (this.node.parent.position.x+480)/192;
        let moveright1 = cc.moveBy(t1, 480-this.node.parent.position.x, this.node.position.y);
        let moveleft1 = cc.moveBy(t2, -(this.node.parent.position.x+480), this.node.position.y);
        let moverighta = cc.moveBy(1, 192, 60);
        let moverightb = cc.moveBy(1, 192, -60);
        let moverightc = cc.moveBy(1, -192, 60);
        let moverightd = cc.moveBy(1, -192, -60);
        
        if(Math.random() > 0.5){
            this.node.runAction(moveleft1);
            this.scheduleOnce(()=>{
                this.node.runAction(cc.repeatForever(cc.sequence(moverighta, moverightb, moverighta, moverightb, moverighta, moverightd, moverightc, moverightd, moverightc, moverightd)));
            }, t2);
            
        }
        else{
            this.node.runAction(moveright1);
            this.scheduleOnce(()=>{
                this.node.runAction(cc.repeatForever(cc.sequence(moverightc, moverightd, moverightc, moverightd, moverightc, moverightb, moverighta, moverightb, moverighta, moverightb)));
            }, t1);
            
        }
    }

    onBeginContact(contact, self, other){
        let num = parseInt(this.money.getComponent(cc.Label).string);
        if(self.node.name == "virus_red1" || self.node.name == "virus_g1")
            num+=5;
        else if(self.node.name == "virus_red2")
            num+=10;
        else   //country monster
            num+=15;

        if(other.tag == 0){
            if(contact.getWorldManifold().normal.y == 1) {
                this.money.getComponent(cc.Label).string = num + '';
                cc.audioEngine.playEffect(this.StepEffect, false);
                other.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, this.jumpvelocity);
                this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -500);
                this.scheduleOnce(()=>{
                    this.node.destroy();
                }, 1)
            }
        } else if(other.tag == 8){
            other.node.destroy();
            this.money.getComponent(cc.Label).string = num + '';
            cc.audioEngine.playEffect(this.BombEffect, false);
            this.node.getComponent(cc.PhysicsCircleCollider).enabled = false;
            this.isDead = true;   
            this.anim.play("virus_die");
            this.scheduleOnce(()=>{
                this.node.destroy();
            }, 1)
        }
        else if(other.tag == 10){
            this.money.getComponent(cc.Label).string = num + '';
            this.node.getComponent(cc.PhysicsCircleCollider).enabled = false;
            cc.audioEngine.playEffect(this.BombEffect, false);
            this.isDead = true;   
            this.anim.play("virus_die");
            this.scheduleOnce(()=>{
                this.node.destroy();
            }, 1)
        }
    }
}
