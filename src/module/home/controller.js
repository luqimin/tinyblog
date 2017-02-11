module.exports = {
    test(){
        console.log(321312321)
    },
    test2(ctx, next){
        ctx.response.body = '2222222222';
    }
};