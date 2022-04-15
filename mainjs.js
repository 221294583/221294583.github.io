const make_temp=1
var alien_power
var angles
var time_count=0
const alien_power_ratio=[10,10,10,10,10,10,10,30]
const alien_power_name=['1','2','3','4','5','6','7','8']

$(document).ready(function () {
    $("#template").hover(function () {
        $("#templ").show();
    }, function () {
        $("#templ").hide();
    }
);
    $(".make_temp").click(function () {
        document.getElementById("template").firstChild.nodeValue=$(this).text();
        document.getElementById("template").setAttribute('key',$(this).attr("key"))
    });
});

function fgo(){
    let type=document.getElementById('template').getAttribute('key')
    var make_turntable="<div id='hitbox_div'></div>"
    make_turntable=make_turntable.concat("<div id='turntable_div'><canvas id='turntable' height='400px' width='400px'></canvas></div>")
    document.getElementById("main").innerHTML=make_turntable
    var radius=drawturntable(type)

    var tname_div=document.createElement('div')
    tname_div.id='tname_div'
    tname_div.innerHTML="<canvas id='tname' height='400px' width='400px'></canvas>"
    document.getElementById('main').appendChild(tname_div)
    drawtname()

    var makehitbox='<canvas id="hitbox" height="400px" width="400px"></canvas>'
    document.getElementById("hitbox_div").innerHTML=makehitbox
    drawhitbox(radius)

    var button_div=document.createElement('div')
    var button_rotate=document.createElement('button')
    button_rotate.id='rotate'
    var button_node=document.createTextNode('ROTATE')
    button_rotate.appendChild(button_node)
    button_div.appendChild(button_rotate)
    document.getElementById("main").appendChild(button_div)
    document.getElementById("rotate").onclick=make_R
    document.getElementById("hitbox").onclick=make_R

    var table_div=document.createElement('div')
    var table=document.createElement('table')
    var table_head=document.createElement('tr')
    var table_head_times=document.createElement('th')
    table_head_times.innerHTML='次数'
    var table_head_name=document.createElement('th')
    table_head_name.innerHTML='结果'
    table.id='show_table'
    table_head.appendChild(table_head_times)
    table_head.appendChild(table_head_name)
    table.appendChild(table_head)
    table_div.appendChild(table)
    document.getElementById('main').appendChild(table_div)
}

function drawhitbox(radius){
    var radius_new=radius/4
    var to_draw=document.getElementById("hitbox")
    if(to_draw.getContext){
        var ctx=to_draw.getContext('2d');
        ctx.lineWidth="3"
        ctx.strokeStyle="green"
        ctx.beginPath();
        ctx.lineJoin='round'
        ctx.moveTo(200+(Math.sqrt(2)*radius_new/2),200-(Math.sqrt(2)*radius_new/2))
        ctx.lineTo(200,200-(Math.sqrt(2)*radius_new))
        ctx.lineTo(200-(Math.sqrt(2)*radius_new/2),200-(Math.sqrt(2)*radius_new/2))
        ctx.arc(200,200,radius_new,-0.25*Math.PI,1.25*Math.PI)
        ctx.fillStyle='green'
        ctx.fill()
        ctx.stroke()
    }
}

function drawtname(initial_angle=0){
    var to_draw=document.getElementById('tname')
    alien_power.cal_text_pos(initial_angle)
    if(to_draw.getContext){
        var ctx=to_draw.getContext('2d')
        ctx.font='10px Arial'
        ctx.textAlign='center'
        ctx.textBaseline='Middle'

        for (var i=0;i<alien_power.name.length;i++){
            ctx.fillText(alien_power.name[i],alien_power.text_pos[i][0],alien_power.text_pos[i][1])
        }
    }
}

function drawturntable(type_code){
    var to_draw=document.getElementById("turntable")
    if (to_draw.getContext){
        var ctx = to_draw.getContext('2d'); 
        var X = to_draw.width / 2;
        var Y = to_draw.height / 2;
        var R = X/2;
        ctx.beginPath();
        ctx.arc(X, Y, R, 0, 2 * Math.PI, false);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FF0000';
        ctx.stroke();
        if(type_code==0||type_code=='境外势力'||type_code=='模板\r'){
            alien_power=new turntable_cut(alien_power_ratio,alien_power_name)
        }
        alien_power.calculate()
        alien_power.cal_pos_map()
        var pair=alien_power.coordination
        for (var i=0; i<pair.length; i++){
            ctx.beginPath()
            ctx.lineWidth="5"
            ctx.strokeStyle="black"
            ctx.moveTo(pair[i][0][0],pair[i][0][1])
            ctx.lineTo(pair[i][1][0],pair[i][1][1])
            ctx.stroke()
        }
        return R
    }
    return 0
}

function make_R(){
    time_count++
    var count=0
    var initial_angle
    if (Array.isArray(angles)){
        initial_angle=angles[angles.length-1]
    }else{
        initial_angle=0
    }
    angles=generate_angles(initial_angle)
    document.getElementById('tname_div').style.display='none'
    var indicator=setInterval(function (){
        if(count==angles.length){
            clearInterval(indicator)
        }
        document.getElementById('turntable').style.transform="rotate("+angles[count]+"deg)"
        count++
    },25)
    var newmap=document.getElementById('tname').getContext('2d').clearRect(0,0,400,400)
    drawtname((angles[angles.length-1]%360)*Math.PI/180)
    var trash=setTimeout(function (){
        document.getElementById('tname_div').style.display='block'
    },(angles.length)*25)
    judge(alien_power,angles[angles.length-1])
}

function generate_angles(initial_angle=0){
    var angles_out=[]
    var acceleration=2
    var initial_velocity=100
    var times=initial_velocity/acceleration
    for (var i=0;i<times;i++){
        angles_out.push(initial_velocity*i-0.5*acceleration*i*i+initial_angle)
    }
    return angles_out
}

function judge(turntable_info,angle_now){
    var operator=360-(angle_now%360)
    console.log(operator)
    for (var i=1;i<turntable_info.pos_map.length;i++){
        if (operator<=turntable_info.pos_map[i] && turntable_info.pos_map[i-1]<operator){
            var to_add=document.createElement('tr')
            var to_add_time=document.createElement('td')
            var to_add_name=document.createElement('td')
            to_add_time.innerHTML=time_count
            to_add_name.innerHTML=turntable_info.name[i-1]
            to_add.appendChild(to_add_time)
            to_add.appendChild(to_add_name)
            document.getElementById('show_table').appendChild(to_add)
        }
    }
}

class turntable_cut{
    constructor(ratio,name){
        this.ratio=ratio
        this.name=name
    }
    calculate(){
        //动画绘线用
        var angles=[]
        for(var i=0;i<this.name.length;i++){
            angles.push((this.ratio[i]/100)*2*Math.PI)
        }
        var sum=[]
        var sum_temp=0-(Math.PI/2)
        for (var i=0;i<angles.length;i++){
            sum_temp+=angles[i]
            sum.push(sum_temp)
        }
        console.log(sum)
        var coordination=[]
        for (var i=0;i<sum.length;i++){
            coordination.push([[200,200],[200+Math.cos(sum[i])*100,200+Math.sin(sum[i])*100]])
        }
        this.coordination=coordination
        sum.unshift(0-(Math.PI/2))
        this.angle=sum
    }
    cal_pos_map(){
        //概率计算用，与动画区分，无需减去pi/2
        var angles=[]
        for(var i=0;i<this.name.length;i++){
            angles.push((this.ratio[i]/100)*360)
        }
        var sum=[]
        var sum_temp=0
        for (var i=0;i<angles.length;i++){
            sum_temp+=angles[i]
            sum.push(sum_temp)
        }
        sum.unshift(0)
        this.pos_map=sum
        console.log(this.pos_map)
    }
    cal_text_pos(initial_angle){
        //动画绘字用
        var text_pos_temp=[]
        for(var i=1;i<this.angle.length;i++){
            text_pos_temp.push(((this.angle[i-1]+this.angle[i])/2)+initial_angle)
        }
        this.text_pos=[]
        var pos_temp
        for(var i=0;i<text_pos_temp.length;i++){
            pos_temp=[200+(Math.cos(text_pos_temp[i]))*75,200+(Math.sin(text_pos_temp[i]))*75]
            this.text_pos.push(pos_temp)
        }
    }
}