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
export default class platform extends cc.Component {

    @property(cc.Prefab)
    rocketPrefab: cc.Prefab = null;

    private anim: cc.Animation = null;

    private animState: cc.AnimationState = null;

    private jumpvelocity : number = 1000;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.anim = this.getComponent(cc.Animation);
        this.animState = null;
        if(this.node.name == "normal_basic"){
            let withrocket = (Math.random()< 0.05) ? true : false;
            if(withrocket){
                let newnode = cc.instantiate(this.rocketPrefab); // newnode is the rocket
                this.node.addChild(newnode);
                newnode.position = cc.v2((Math.random()>0.5)? 60*Math.random() : -60*Math.random(), 37.2); // 37.2 = half of platform's height + half of 0.6rocket's height
                newnode.scale = 0.6;
            }
        }
        else if(this.node.name == "move_basic"){
            let dir = (Math.random() > 0.5) ? "v" : "h"; // choose move vertical or horizontal
            if(dir == 'v') this.platformmove_v();
            else this.platformmove_h();
            let withrocket = (Math.random()< 0.01) ? true : false;
            if(withrocket){
                let newnode = cc.instantiate(this.rocketPrefab);
                this.node.addChild(newnode);
                newnode.position = cc.v2((Math.random()>0.5)? 60*Math.random() : -60*Math.random(), 37.2); // 37.2 = half of platform's height + half of 0.6rocket's height
                newnode.scale = 0.6;
            }
        }
        else if(this.node.name == "time_basic"){

        }
        else if(this.node.name == "break_basic"){
            
        }
    }

    private platformmove_v(){
        let easeRate: number = Math.random() * 3;
        let movespeed = Math.random() * 50;
        let moveright = cc.moveBy(2, movespeed, 0);
        let moveleft = cc.moveBy(2, -movespeed, 0);
        moveright.easing(cc.easeInOut(easeRate));
        moveleft.easing(cc.easeInOut(easeRate));
        this.node.runAction(cc.repeatForever(cc.sequence(moveright, moveleft)));
    }
    
    private platformmove_h(){
        let easeRate: number = Math.random() * 3;
        let movespeed = Math.random() * 50;
        let moveup = cc.moveBy(2, 0, movespeed);
        let movedown = cc.moveBy(2, 0, -movespeed);
        moveup.easing(cc.easeInOut(easeRate));
        movedown.easing(cc.easeInOut(easeRate));
        this.node.runAction(cc.repeatForever(cc.sequence(moveup, movedown)));
    }
    update (dt) {}

    onBeginContact(contact, self, other){
        if(contact.getWorldManifold().normal.y != 1 || contact.getWorldManifold().normal.x != 0){
            contact.disabled = true;
        }
        else{
            if(self.node.name == "break_basic"){
                contact.disabled = true;
                this.anim.play("basic_break");
                this.scheduleOnce(function(){
                    this.node.destroy();
                  }, 0.3)
            }
            else if(self.node.name == "time_basic"){
                if(this.animState == null || this.animState.name != "basic_time")this.animState = this.anim.play("basic_time");
                this.scheduleOnce(function(){
                    this.node.destroy();
                  }, 1.3)
                other.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, this.jumpvelocity);
                
            }
            else if(other.tag == 0 /* player*/ ) other.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, this.jumpvelocity);
        }
    }
}
