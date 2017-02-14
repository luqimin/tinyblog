export default {
    async index(ctx){
        console.log(tiny);

        tiny.display();
    },
    test2(ctx, next) {
        ctx.response.body = '2222222222';
    },
}