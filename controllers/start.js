// start test:
const moment = require('moment-timezone');
var getOder = require('../models/random')
var fs = require('fs')
var video_url = "https://github.com/bryan22lee/QoEProject/raw/master/videos/amazon2/"; // Videos for testing


var post_start = async (ctx, next) => {
    // August 27th 2020, 12:00:28 am
    var time_start = moment().tz('America/Chicago').format('MMMM Do YYYY, h:mm:ss a'); // Central time

    var mturkID = ctx.request.body.MTurkID;
    var device = ctx.request.body.device;
    var age = ctx.request.body.age;
    var network = ctx.request.body.network;
    var video_order = getOder(1,5);
    console.log(mturkID, device, age);
    var start = new Date().getTime();

    let user = {
        mturkID : mturkID,
        device : device,
        age : age,
        network : network,
        video_order : video_order,
        count : 1,
        result : [],
        video_time :[],
        grade_time:[],
        start: start,
        time_start : time_start
    };
    let value =  Buffer.from(JSON.stringify(user)).toString('base64');
    ctx.cookies.set('name', value);
    var video_src = video_url + video_order[0] + ".mp4";
    // https://github.com/michaelliao/learn-javascript/raw/master/video/vscode-nodejs.mp4
    // very interesting url!


    ctx.render('video.html', {
        title: '1/5', video_src : video_src
    });
}

var post_grade= async (ctx, next) => {
    var user = ctx.state.user;
    var end = new Date().getTime();
    var exe_time = end - user.start;
    user.video_time.push(exe_time);
    user.start = end;

    let value =  Buffer.from(JSON.stringify(user)).toString('base64');
    ctx.cookies.set('name', value);

    var title = user.count + "/5";
    ctx.render('grade.html', {
        title: title, count: user.count
    });
}


var post_back2video = async (ctx, next) => {
    var user = ctx.state.user;
    var video_src = video_url + user.video_order[user.count - 1] + ".mp4";
    var title = user.count +"/5";
    ctx.render('video.html', {
        title: title, video_src: video_src
    });
}
 var post_next = async (ctx, next) => {
    var user = ctx.state.user;
    var grade = ctx.request.body.sentiment;
    user.result.push(grade);
    var end = new Date().getTime();
    var exe_time = end - user.start;
    user.grade_time.push(exe_time);
    user.start = end;
    if(user.count < 5) {
        var video_src = video_url + user.video_order[user.count] + ".mp4";
        user.count = user.count + 1;
        var title = user.count +"/5";

        // set new cookie
        let value =  Buffer.from(JSON.stringify(user)).toString('base64');
        ctx.cookies.set('name', value);
        ctx.render('video.html', {
            title: title, video_src: video_src
        });
    }
    else {
        console.log(user.result);
        var filename = "./results/" + user.mturkID + ".txt";
        var write_data = [];
        var write_video_time = [], write_grade_time =[];
        for(var i in user.video_order) {
            write_data[user.video_order[i] - 1] = user.result[i];
            write_video_time[user.video_order[i] - 1] = user.video_time[i];
            write_grade_time[user.video_order[i] - 1] = user.grade_time[i];
        }
        fs.writeFile(filename, write_data + '\n'+ user.video_order + '\n' + 
                    write_video_time + '\n'
                     + write_grade_time + '\n' + user.mturkID + '\n' 
                     + user.device + '\n' + user.age + '\n' 
                     + user.network + '\n' + user.start, + '\n' + user.time_start, function(err) {
            if(err) {
                return console.log(err);
            }
        });
        // clear cookie
        ctx.cookies.set('name','');

        var return_code = "0lMq2GKqLDSUgYAGc=";
        ctx.render('ending.html', {
            title: 'Thank you', return_code:return_code
        });
    }
}



module.exports = {
    'POST /start' : post_start,
    'POST /grade': post_grade,
    'POST /back2video':post_back2video,
    'POST /next' : post_next

};
