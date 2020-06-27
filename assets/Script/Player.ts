import GameMgr from "./GameMgr";
const {ccclass, property} = cc._decorator;

@ccclass
export default class player extends cc.Component {

    private leftDown: boolean = false; // key for player to go left

    private rightDown: boolean = false; // key for player to go right

    private spaceDown: boolean = false; //get enemy

    private rocketOn: boolean = false;

    private playerSpeed: number = 0;

    private bulletspeed = 500;
    private maxbullet = 3;

    private anim = null;

    private animateState = null;

    private isDied = false;

    private knife: cc.Node = null;

    //0:default 1:shield protect 2:rocket
    private mode = 0;

    // 0: normal, 1: snow, 2:ninja
    private kirby_state = 0;

    // record money
    @property(cc.Node)
    money: cc.Node = null;

    @property({ type: cc.AudioClip })
    soundEffect: cc.AudioClip = null;

    platform: cc.Node;//
    bulletPool: cc.Node;

    @property(cc.Node)
    platforms: cc.Node = null;

    @property({type:cc.AudioClip})
    abilitySound: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    CoinEffect: cc.AudioClip = null;

    @property(GameMgr)
    gamemanager: GameMgr = null;

    @property(cc.Prefab)
    bullet: cc.Prefab = null;

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;   
        this.anim = this.getComponent(cc.Animation);
        this.platform = cc.find("Canvas/platform");
        this.bulletPool = cc.find("Canvas/bullet");
        this.knife = cc.find("Canvas/knife");
        this.kirby_state = 0;
    }

    start () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.node.getComponent(cc.RigidBody).linearVelocity = cc. v2(0, 1000);
        this.anim.play("jump");
    }

    onKeyDown(event) {
        if(event.keyCode == cc.macro.KEY.a) {
            this.leftDown = true;
            this.rightDown = false;
        } else if(event.keyCode == cc.macro.KEY.d) {
            this.leftDown = false;
            this.rightDown = true;
        } 
        if(event.keyCode == cc.macro.KEY.space){
            this.spaceDown = true;

            switch(this.kirby_state){
                case 0: {
                    if(this.anim.getAnimationState('jump').isPlaying){
                        this.anim.stop('jump');
                        this.animateState = this.anim.play('suck');
                    }
                    break;
                }
                case 1: {
                    if(this.anim.getAnimationState('snow_jump').isPlaying){
                        this.anim.stop('snow_jump');
                        this.animateState = this.anim.play('snow_suck');
                    }
                    break;
                }
                case 2: {
                    if(this.anim.getAnimationState('ninja_jump').isPlaying){
                        this.anim.stop('ninja_jump');
                        this.animateState = this.anim.play('ninja_suck');
                    }
                    break;
                }
                case 3: {
                    if(this.anim.getAnimationState('magic_jump').isPlaying){
                        this.anim.stop('magic_jump');
                        this.animateState = this.anim.play('magic_suck');
                    }
                    break;
                }
                default: {
                    if(this.anim.getAnimationState('jump').isPlaying){
                        this.anim.stop('jump');
                        this.animateState = this.anim.play('suck');
                    }
                    break;
                }
            }
        }
    }
    
    onKeyUp(event) {
        if(event.keyCode == cc.macro.KEY.a)  
            this.leftDown = false;
        else if(event.keyCode == cc.macro.KEY.d)
            this.rightDown = false;
        if(event.keyCode == cc.macro.KEY.space){
            this.spaceDown = false;

            switch(this.kirby_state){
                case 0: {
                    if(this.anim.getAnimationState('suck').isPlaying){
                        this.anim.stop('suck');
                        this.animateState = this.anim.play('stopsuck');
                    }
                    break;
                }
                case 1: {
                    if(this.anim.getAnimationState('snow_suck').isPlaying){
                        this.anim.stop('snow_suck');
                        this.animateState = this.anim.play('stop_snowsuck');
                    }
                    break;
                }
                case 2: {
                    if(this.anim.getAnimationState('ninja_suck').isPlaying){
                        this.anim.stop('ninja_suck');
                        this.animateState = this.anim.play('stop_ninjasuck');
                    }
                    break;
                }
                case 3: {
                    if(this.anim.getAnimationState('magic_suck').isPlaying){
                        this.anim.stop('magic_suck');
                        this.animateState = this.anim.play('stop_magicsuck');
                    }
                    break;
                }
                default: {
                    if(this.anim.getAnimationState('suck').isPlaying){
                        this.anim.stop('suck');
                        this.animateState = this.anim.play('stopsuck');
                    }
                    break;
                }
            }
        }
    }

    update (dt) {
        this.playermovement(dt);
        if(this.node.x-11.5 <= -480 && this.leftDown){
            this.node.x = 491.5;
        }
        else if(this.node.x + 11.5 >= 480 && this.rightDown){
            this.node.x = -491.5;
        }
    }

    onBeginContact(contact, self, other){
        if(self.tag == 0){

            if(other.tag == 1 && other.node.name != "break_basic" && contact.getWorldManifold().normal.y == -1) cc.audioEngine.playEffect(this.soundEffect, false);

            if(other.tag == 4 || other.tag == 5 || other.tag == 6 ){
                if(other.tag == 5 && this.spaceDown){
                    if(other.node.name == "snowman_enemy"){
                        // this.node.scaleX = (this.node.scaleX > 0) ? 1.5 : -1.5;
                        // this.node.scaleY = 1.5;
                        this.anim.play("changetosnow");
                        this.kirby_state = 1;
                    }
                    else if(other.node.name == "ninja_enemy"){
                        // this.node.scaleX = (this.node.scaleX > 0) ? 1.5 : -1.5;
                        // this.node.scaleY = 1.5;
                        this.anim.play("changetoninja");
                        this.kirby_state = 2;
                    }
                    else if(other.node.name == "magic_enemy"){
                        this.anim.play("changetomagic");
                        this.kirby_state = 3;
                    }
                }
                if(this.mode > 0){
                    contact.disabled = true; 
                    return;
                }
                if((!this.spaceDown && other.tag == 5) || other.tag == 4){
                    if(contact.getWorldManifold().normal.y == 1 || contact.getWorldManifold().normal.x != 0){ // enemy and doesn't contact from top
                        //cc.log("gameover");
                        this.gameover();
                    }
                }
                if(other.tag == 6){ 
                    this.isDied = true;
                    this.gameover();
                }  
            }
            else if(other.tag == 7){
                let num = parseInt(this.money.getComponent(cc.Label).string);
                num += 1;
                this.money.getComponent(cc.Label).string = num + '';
                cc.audioEngine.playEffect(this.CoinEffect, false);
                contact.disabled = true;
                other.node.destroy();
            }
            else{
                if(contact.getWorldManifold().normal.y != -1 || contact.getWorldManifold().normal.x != 0)
                contact.disabled = true;
                else{
                    if(other.tag == 1 && this.mode != 2 && this.kirby_state == 0){
                        this.animateState = this.anim.play("jump");
                    }
                    else if(other.tag == 1 && this.mode != 2 && this.kirby_state == 1){
                        this.animateState = this.anim.play("snow_jump");
                    }
                    else if(other.tag == 1 && this.mode != 2 && this.kirby_state == 2){
                        this.animateState = this.anim.play("ninja_jump");
                    }
                    else if(other.tag == 1 && this.mode != 2 && this.kirby_state == 3){
                        this.animateState = this.anim.play("magic_jump");
                    }
                }
            }
        } else if(self.tag == 3 && other.tag == 5){ //can't suck during rocket
            contact.disabled = true;
            if(!this.spaceDown)
                return;
            //other.node.runAction(cc.moveTo(3, self.node.position.sub(cc.v2(480, 320))).easing(cc.easeCubicActionOut()));
        } else{
            contact.disabled = true;
        }
    }

    onPreSolve(contact, self, other){
        if(self.tag == 0 && other.tag == 5 && this.spaceDown){ //get ability
            contact.disabled = true;
            cc.audioEngine.playEffect(this.abilitySound, false);
            if(other.node.name == "ninja_enemy"){
                
            }
            other.node.destroy();
            return;
        }
        if(self.tag == 3 && other.tag == 5 && !this.anim.getAnimationState('rocket').isPlaying && !this.anim.getAnimationState('snow_rocket').isPlaying){
            if(!this.spaceDown || !other.node.isValid){
                //contact.disabled = true;
                return;
            }
            let move = self.node.position.sub(other.node.parent.position).sub(other.node.position).divSelf(8);
            //cc.log(move)
            //other.node.stopAllActions();
            other.node.runAction(cc.moveBy(0.2, move));
        }
    }

    private playermovement(dt){
        this.playerSpeed = 0;
        if(this.leftDown){
            this.playerSpeed = -400;
            this.node.scaleX = -2;
        }
        else if(this.rightDown){
            this.playerSpeed = 400;
            this.node.scaleX = 2;
        }

        this.node.x += this.playerSpeed * dt;
    }

    private gameover(){
        //this.node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Kinematic;
        this.isDied = true;
        //cc.log(this.isDied);
        switch(this.kirby_state){
            case 0: {                 // normal
                this.anim.stop('jump');
                this.animateState = this.anim.play("die");
                break;
            }
            case 1: {                 // snowman
                this.anim.stop('snow_jump');
                this.animateState = this.anim.play("snowman_die");
                break;
            }
            case 2: {                 // ninja
                this.anim.stop('ninja_jump');
                this.animateState = this.anim.play("ninja_die");
                break;
            }
            case 3: {                //magic
                this.anim.stop('magic_jump');
                this.animateState = this.anim.play("magic_die");
                break;
            }
            default: {
                this.anim.stop('jump');
                this.animateState = this.anim.play("die");
                break;
            }
        }
        this.node.getComponent(cc.RigidBody).enabledContactListener = false;
        //get money and score to database, handle by GameMgr
        this.gamemanager.gameover(parseInt(this.money.getComponent(cc.Label).string));
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        this.scheduleOnce(()=>{ 
            this.platforms.removeAllChildren();
            this.bulletPool.removeAllChildren();
            this.knife.removeAllChildren();
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 150);
        }, 0.3);
    }

    private attack(x: number, y: number, playerpos: cc.Vec2){
        if(this.anim.getAnimationState('rocket').isPlaying || this.anim.getAnimationState('snow_rocket').isPlaying)
            return;
        //can only attack maxbullet in window
        if(this.bulletPool.childrenCount >= this.maxbullet)
            return;

        if(playerpos.x > x)
            this.node.scaleX = -2;
        else
            this.node.scaleX = 2;
        let newnode = cc.instantiate(this.bullet);
        this.bulletPool.addChild(newnode);
        newnode.position = cc.v2(this.node.position.add(cc.v2(14, 0)));
        //direction vector for bullet
        let dir = cc.v2(x,y).sub(playerpos);
        //linearVelocity = unit vector multiple bulletspeed
        newnode.getComponent(cc.RigidBody).linearVelocity = dir.divSelf(dir.mag()).mulSelf(this.bulletspeed);
    }

    setmode(status : string){
        if(status == "shield")
            this.mode++;
        else if(status == "unshield")
            this.mode--;
        else if(status == "rocket"){
            this.mode++;
            this.rocketOn = true;
        } else if(status == "unrocket"){
            this.mode--;
            this.rocketOn = false;
        }
    }

    get_state(){
        return this.kirby_state;
    }
}
