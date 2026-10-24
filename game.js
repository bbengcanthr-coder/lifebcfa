(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, n));
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const chance = (p) => Math.random() < p;

  const ERA = {
    han: { th: 'ปลายฮั่น', cn: '汉末', regnal: ['建安', '初平', '兴平'], places: ['ลั่วหยาง 洛阳', 'เจียงตง 江东', 'ฉางอัน 长安', 'จิ้งโจว 荆州', 'มณฑลสู่ 蜀地'] },
    tang: { th: 'ราชวงศ์ถัง', cn: '大唐', regnal: ['贞观', '开元', '天宝'], places: ['ฉางอัน 长安', 'ลั่วหยาง 洛阳', 'เจียงหนาน 江南', 'หลิงหนาน 岭南', 'ซู่โจว 苏州'] },
    song: { th: 'ราชวงศ์ซ่ง', cn: '两宋', regnal: ['咸平', '熙宁', '绍兴'], places: ['ไคเฟิง 开封', 'หลินอัน 临安', 'หางโจว 杭州', 'เจียงหนาน 江南', 'ฉวนโจว 泉州'] },
    ming: { th: 'ราชวงศ์หมิง', cn: '大明', regnal: ['永乐', '宣德', '万历'], places: ['หนานจิง 南京', 'ปักกิ่ง 北京', 'ซูโจว 苏州', 'หางโจว 杭州', 'ฝูเจี้ยน 福建'] }
  };

  const surnames = [
    ['沈','เสิ่น'],['顾','กู้'],['林','หลิน'],['苏','ซู'],['陆','ลู่'],['萧','เซียว'],['宋','ซ่ง'],['柳','หลิ่ว'],['白','ไป๋'],['裴','เผย'],['江','เจียง'],['谢','เซี่ย'],['温','เวิน'],['叶','เย่'],['周','โจว'],['唐','ถัง'],['楚','ฉู่'],['秦','ฉิน'],['顾','กู้'],['陆','ลู่'],['许','สวี่'],['程','เฉิง'],['贺','เฮ่อ'],['顾','กู้'],['容','หรง'],['宁','หนิง']
  ];
  const givenNames = [
    {cn:'知微',th:'จือเวย',g:'หญิง'},{cn:'清和',th:'ชิงเหอ',g:'หญิง'},{cn:'若棠',th:'รั่วถัง',g:'หญิง'},{cn:'晚宁',th:'หว่านหนิง',g:'หญิง'},
    {cn:'云舒',th:'อวิ๋นซู',g:'หญิง'},{cn:'令仪',th:'ลิ่งอี๋',g:'หญิง'},{cn:'月白',th:'เยว่ไป๋',g:'หญิง'},{cn:'疏影',th:'ซู่อิ่ง',g:'หญิง'},
    {cn:'明珠',th:'หมิงจู',g:'หญิง'},{cn:'玉衡',th:'อวี้เหิง',g:'หญิง'},{cn:'书瑶',th:'ซูเหยา',g:'หญิง'},{cn:'锦心',th:'จิ่นซิน',g:'หญิง'},
    {cn:'长风',th:'ฉางเฟิง',g:'ชาย'},{cn:'景行',th:'จิ่งสิง',g:'ชาย'},{cn:'怀瑾',th:'หวยจิ่น',g:'ชาย'},{cn:'子谦',th:'จื่อเชียน',g:'ชาย'},
    {cn:'明远',th:'หมิงหย่วน',g:'ชาย'},{cn:'承安',th:'เฉิงอัน',g:'ชาย'},{cn:'闻舟',th:'เหวินโจว',g:'ชาย'},{cn:'知白',th:'จือไป๋',g:'ชาย'},
    {cn:'云峥',th:'อวิ๋นเจิง',g:'ชาย'},{cn:'怀川',th:'หวยชวน',g:'ชาย'},{cn:'清越',th:'ชิงเยว่',g:'ชาย'},{cn:'修远',th:'ซิวหย่วน',g:'ชาย'},
    {cn:'砚之',th:'เยี่ยนจือ',g:'ชาย'},{cn:'景澄',th:'จิ่งเฉิง',g:'ชาย'},{cn:'知礼',th:'จือหลี่',g:'ชาย'},{cn:'玄度',th:'เสวียนตู้',g:'ชาย'}
  ];
  const origins = [
    {name:'ครอบครัวชาวนา', tier:'สามัญชน', wealth:[3,18], knowledge:[0,8], fame:[0,7], bond:[25,55], weight:35, detail:'ครอบครัวของเจ้าพึ่งพาผืนดินและฤดูกาล ชีวิตเริ่มจากความเรียบง่ายและแรงกาย'},
    {name:'ครอบครัวพ่อค้า', tier:'เรือนพาณิชย์', wealth:[16,40], knowledge:[2,12], fame:[2,11], bond:[25,60], weight:20, detail:'บ้านของเจ้ารู้จักตลาด เส้นทางค้า และคุณค่าของคำมั่น'},
    {name:'ครอบครัวช่างฝีมือ', tier:'ช่างหลวง / ช่างเมือง', wealth:[8,28], knowledge:[4,15], fame:[1,10], bond:[25,55], weight:15, detail:'ครอบครัวของเจ้าสืบทอดฝีมือและความอดทนจากรุ่นสู่รุ่น'},
    {name:'ตระกูลบัณฑิต', tier:'บัณฑิต', wealth:[12,35], knowledge:[15,30], fame:[6,16], bond:[25,60], weight:13, detail:'ตำราและคำสอนของบรรพชนล้อมรอบวัยเยาว์ของเจ้า'},
    {name:'ตระกูลขุนนาง', tier:'สกุลขุนนาง', wealth:[35,70], knowledge:[10,25], fame:[15,29], bond:[35,70], weight:12, detail:'เจ้าถือกำเนิดท่ามกลางพิธีการ สายสัมพันธ์ และความคาดหวังของสกุล'},
    {name:'เชื้อพระวงศ์', tier:'ราชสกุล', wealth:[60,95], knowledge:[12,28], fame:[22,38], bond:[30,65], weight:5, detail:'ตั้งแต่ลืมตา เจ้าก็อยู่ใกล้ศูนย์กลางอำนาจและความเปลี่ยนแปลงของราชสำนัก'}
  ];
  const milestones = {
    6: {k:'วัยเยาว์', title:'วันแรกที่ได้เรียนอักษร', description:'เด็กวัยเดียวกับเจ้ามักเริ่มจดจำถ้อยคำและธรรมเนียม ผู้ใหญ่ในบ้านมองเจ้าด้วยความหวัง', choices:[
      {label:'ฝากตัวกับครูในหมู่บ้าน',sub:'ความรู้เพิ่มขึ้นเล็กน้อย',fx:{knowledge:8,wealth:-3}},
      {label:'ช่วยงานครอบครัว',sub:'ผูกพันกับบ้านและวิถีชีวิต',fx:{bond:8,wealth:3}},
      {label:'วิ่งเล่นในตรอกตลาด',sub:'รู้จักผู้คนและโลกภายนอก',fx:{health:4,bond:5,fame:2}}
    ]},
    12: {k:'วัยแรกรุ่น', title:'ทางแยกของวัยเยาว์', description:'ความสนใจเริ่มชัดเจนขึ้น แต่ทรัพยากรของครอบครัวมีจำกัด เจ้าจะใช้เวลาว่างอย่างไร', choices:[
      {label:'มุ่งมั่นร่ำเรียน',sub:'วางรากฐานสำหรับวันหน้า',fx:{knowledge:11,wealth:-5}},
      {label:'ฝึกฝีมือกับผู้ใหญ่',sub:'สร้างทักษะที่ใช้เลี้ยงชีพ',fx:{wealth:5,knowledge:4}},
      {label:'ดูแลคนในบ้าน',sub:'สายสัมพันธ์แน่นแฟ้นขึ้น',fx:{bond:10,health:3}}
    ]},
    16: {k:'ก้าวสู่วัยผู้ใหญ่', title:'ชีวิตเริ่มเป็นของตนเอง', description:'โลกภายนอกเปิดประตูออกกว้าง ทั้งการสอบ การค้า และการเดินทางล้วนมีความเสี่ยง', choices:[
      {label:'เตรียมตัวสอบคัดเลือก',sub:'อาจนำไปสู่ตำแหน่งและชื่อเสียง',fx:{knowledge:10,fame:5,wealth:-5},requires:'study'},
      {label:'เข้าช่วยกิจการของบ้าน',sub:'ฐานะมั่นคงขึ้นทีละน้อย',fx:{wealth:10,bond:5}},
      {label:'ออกจากบ้านไปเปิดหูเปิดตา',sub:'ได้ประสบการณ์ แต่เสี่ยงต่อสุขภาพ',fx:{knowledge:4,fame:4,health:-3}}
    ]},
    20: {k:'วัยหนุ่มสาว', title:'คำมั่นและความผูกพัน', description:'ญาติผู้ใหญ่เริ่มเอ่ยถึงการสร้างครอบครัวหรือสร้างฐานะ เจ้าจะตอบรับธรรมเนียมเดิมหรือเดินตามใจตนเอง', choices:[
      {label:'ยอมให้ผู้ใหญ่จัดการเรื่องคู่ครอง',sub:'สายสัมพันธ์ครอบครัวเพิ่มขึ้น',fx:{bond:13,wealth:-4},marry:true},
      {label:'ขอเวลาเดินทางและเรียนรู้',sub:'โอกาสและประสบการณ์เพิ่มขึ้น',fx:{knowledge:5,fame:3,health:-2}},
      {label:'ตั้งตัวด้วยการทำงาน',sub:'เก็บทรัพย์สินเพื่ออนาคต',fx:{wealth:12,fame:2}}
    ]},
    30: {k:'วัยกลางคน', title:'ภาระที่ชื่อว่าครอบครัว', description:'เวลาหลายปีผ่านไป เจ้าต้องเลือกระหว่างความก้าวหน้า ความสงบ และคนที่อยู่เคียงข้าง', choices:[
      {label:'ทุ่มเทเพื่อเรือนและลูกหลาน',sub:'ความสัมพันธ์แข็งแรงขึ้น',fx:{bond:12,wealth:-5,health:2}},
      {label:'แสวงหาความก้าวหน้า',sub:'ชื่อเสียงและสถานะอาจสูงขึ้น',fx:{fame:11,knowledge:4,health:-4}},
      {label:'ใช้ชีวิตเรียบง่าย',sub:'รักษากายใจและเก็บเงิน',fx:{health:7,wealth:5}}
    ]},
    45: {k:'วัยกลางคนตอนปลาย', title:'เมื่อกาลเวลาเริ่มฝากรอย', description:'สิ่งที่เคยไล่ตามอาจเปลี่ยนความหมาย เจ้าจะใช้กำลังที่เหลือทำสิ่งใด', choices:[
      {label:'ถ่ายทอดความรู้ให้คนรุ่นหลัง',sub:'มรดกทางความคิดและชื่อเสียง',fx:{knowledge:8,fame:8,bond:5}},
      {label:'ดูแลสุขภาพอย่างจริงจัง',sub:'รักษากำลังและความสงบ',fx:{health:10,wealth:-6}},
      {label:'เดินทางกลับไปหาคนสำคัญ',sub:'สายสัมพันธ์ลึกซึ้งขึ้น',fx:{bond:12,wealth:-4}}
    ]},
    60: {k:'วัยชรา', title:'เสียงลมใต้ชายคา', description:'เรื่องราวในอดีตกลายเป็นความทรงจำ คนรุ่นใหม่เริ่มเดินทางของตน เจ้าจะฝากสิ่งใดไว้', choices:[
      {label:'บันทึกเรื่องราวของตระกูล',sub:'ชื่อเสียงและความรู้คงอยู่',fx:{knowledge:7,fame:7}},
      {label:'ใช้เวลากับครอบครัว',sub:'ความอบอุ่นคือสิ่งสำคัญ',fx:{bond:12,health:3}},
      {label:'ทำบุญและช่วยเหลือชุมชน',sub:'ผู้คนจดจำความเมตตา',fx:{fame:8,wealth:-8,bond:5}}
    ]},
    75: {k:'บั้นปลาย', title:'ใต้ฟ้าเดียวกัน', description:'มองย้อนกลับไป ชีวิตของเจ้าได้ผ่านฤดูกาลมามากมาย ต่อจากนี้สิ่งใดสำคัญที่สุด', choices:[
      {label:'สงบนิ่งกับวันคืนที่เหลือ',sub:'รักษาสุขภาพและใจให้สงบ',fx:{health:6}},
      {label:'เล่าเรื่องเก่าให้ลูกหลานฟัง',sub:'ความผูกพันและความทรงจำเพิ่มขึ้น',fx:{bond:8,fame:3}},
      {label:'เปิดประตูต้อนรับผู้มาเยือน',sub:'สายสัมพันธ์กับชุมชนแน่นแฟ้น',fx:{bond:5,fame:5}}
    ]}
  };

  const randomEvents = [
    {k:'เรื่องเล่าริมทาง',title:'พ่อค้าเร่จากดินแดนไกล',description:'พ่อค้าเร่คนหนึ่งหยุดพักใกล้บ้าน เขามีของแปลกตาและข่าวจากเมืองอื่น',choices:[
      {label:'แลกเปลี่ยนสินค้า',sub:'เสี่ยงเล็กน้อยเพื่อโอกาส',fx:{wealth:rand(4,12),fame:2}},
      {label:'นั่งฟังเรื่องราว',sub:'เรียนรู้โลกผ่านคำบอกเล่า',fx:{knowledge:5,bond:3}},
      {label:'ปฏิเสธแล้วกลับไปทำงาน',sub:'เก็บแรงไว้กับสิ่งตรงหน้า',fx:{health:2,wealth:2}}
    ]},
    {k:'ฟ้าฝนแปรปรวน',title:'ฝนใหญ่ตลอดสามวัน',description:'ฝนตกไม่ขาดสาย ถนนกลายเป็นโคลน และผู้คนในละแวกต่างได้รับผลกระทบ',choices:[
      {label:'ช่วยเพื่อนบ้านซ่อมหลังคา',sub:'เสียเวลาแต่ได้มิตรภาพ',fx:{health:-2,bond:8,fame:2}},
      {label:'เก็บตัวอยู่ในเรือน',sub:'ป้องกันตัวเองจากอากาศ',fx:{health:3}},
      {label:'ซื้อเสบียงสำรอง',sub:'มั่นคงขึ้นแต่มีค่าใช้จ่าย',fx:{wealth:-4,health:2}}
    ]},
    {k:'ข่าวจากเมืองหลวง',title:'ประกาศจากราชสำนัก',description:'ข่าวการเปลี่ยนแปลงในเมืองหลวงเดินทางมาถึงถิ่นของเจ้า ผู้คนต่างคาดเดาถึงผลที่จะตามมา',choices:[
      {label:'ติดตามข่าวอย่างใกล้ชิด',sub:'เพิ่มความรู้และความเข้าใจ',fx:{knowledge:5,fame:2}},
      {label:'รักษาระยะห่างจากการเมือง',sub:'ความเสี่ยงลดลง',fx:{health:2,bond:2}},
      {label:'ช่วยกระจายข่าวให้ชุมชน',sub:'ผู้คนอาจจดจำชื่อของเจ้า',fx:{fame:5,bond:3}}
    ]},
    {k:'ผู้มาเยือน',title:'คนแปลกหน้าที่บาดเจ็บ',description:'ระหว่างเดินทาง เจ้าพบคนเดินทางผู้หนึ่งที่ต้องการความช่วยเหลือ แต่การหยุดพักก็มีต้นทุน',choices:[
      {label:'ช่วยทำแผลและแบ่งอาหาร',sub:'เมตตาแต่เสียทรัพย์',fx:{fame:4,bond:6,wealth:-4}},
      {label:'แนะนำให้ไปยังโรงเตี๊ยม',sub:'ช่วยเท่าที่กำลังไหว',fx:{bond:2}},
      {label:'เดินทางต่อ',sub:'รักษาเวลาและกำลังของตน',fx:{health:2}}
    ]},
    {k:'โอกาสของชีวิต',title:'ผู้มีความสามารถสังเกตเห็นเจ้า',description:'ผู้ใหญ่คนหนึ่งเห็นความตั้งใจหรือฝีมือของเจ้า และเสนอทางเลือกที่อาจเปลี่ยนเส้นทางชีวิต',choices:[
      {label:'รับคำแนะนำและฝึกฝน',sub:'ความรู้และชื่อเสียงเพิ่มขึ้น',fx:{knowledge:7,fame:5}},
      {label:'ขอเวลาพิจารณา',sub:'เดินหน้าช้า ๆ อย่างรอบคอบ',fx:{health:2,knowledge:2}},
      {label:'ปฏิเสธอย่างสุภาพ',sub:'ยึดมั่นในเส้นทางเดิม',fx:{bond:3,health:1}}
    ]}
  ];

  const state = {
    live:false, dead:false, paused:false, auto:true, speed:1, timer:null, eventTimer:null,
    eventCountdownTimer:null, currentEvent:null, age:0, eraKey:'tang', era:null, regnal:'开元', yearBase:712,
    character:null, stats:null, log:[], actionUsedAge:-1, playedMilestones:[], hasPartner:false, children:0,
    lastEventAge:-10, autoRemain:7, birthDate:new Date().toISOString(), saved:false
  };
  let audioCtx = null, musicOn = false, musicTimer = null, musicStep = 0, toastTimer = null;
  const soundNotes = [293.66,369.99,440,554.37,659.25,554.37,440,369.99,329.63,440,554.37,493.88];

  function weightedOrigin(){
    const total = origins.reduce((s,o)=>s+o.weight,0); let r = Math.random()*total;
    for(const o of origins){r-=o.weight;if(r<=0)return o;} return origins[0];
  }
  function chooseEra(value){
    const keys=Object.keys(ERA); const key=value==='random'?pick(keys):value;
    return {key, ...ERA[key]};
  }
  function randomCharacter(){
    const gender=chance(.5)?'หญิง':'ชาย';
    let givenPool=givenNames.filter(n=>n.g===gender); const given=pick(givenPool), surname=pick(surnames);
    const origin=weightedOrigin();
    const health=rand(51,94);
    return {
      cn:surname[0]+given.cn, th:surname[1]+given.th, gender, origin,
      birthplace:pick(state.era.places), healthAtBirth:health,
      temperament:pick(['สุขุมรอบคอบ','กล้าหาญและเด็ดเดี่ยว','อ่อนโยนและมีเมตตา','ใฝ่รู้และช่างสังเกต','มุ่งมั่นไม่ย่อท้อ','รักอิสระและเดินทาง']),
      fateLine:pick(['เกิดใต้ร่มเงาของขุนเขา','ถือกำเนิดในคืนฝนพรำ','ลืมตาดูโลกในฤดูดอกเหมย','แรกเกิดในปีที่เมืองคึกคัก','เกิดในวันที่ระฆังวัดดังยามรุ่งสาง'])
    };
  }
  function startLife(){
    stopTicker(); closeEvent(); stopMusic();
    state.live=true;state.dead=false;state.paused=false;state.auto=true;state.speed=1;state.age=0;state.log=[];state.playedMilestones=[];state.actionUsedAge=-1;state.hasPartner=false;state.children=0;state.lastEventAge=-10;state.saved=false;
    state.era=chooseEra($('eraSelect').value);state.eraKey=state.era.key;state.regnal=pick(state.era.regnal);state.yearBase=state.eraKey==='han'?rand(190,220):state.eraKey==='tang'?rand(630,740):state.eraKey==='song'?rand(970,1180):rand(1370,1580);
    state.character=randomCharacter();state.stats={health:state.character.healthAtBirth,knowledge:state.character.origin.knowledge[0]+rand(0,5),fame:state.character.origin.fame[0]+rand(0,4),wealth:rand(...state.character.origin.wealth),bond:rand(...state.character.origin.bond)};
    addLog('初生','降生人世',`${state.character.th}出生于${state.character.birthplace}。${state.character.origin.detail}。`);
    $('startScreen').classList.add('hidden');$('lifeScreen').classList.remove('hidden');$('lifeEnd').classList.add('hidden');$('eventBackdrop').classList.add('hidden');
    $('autoBtn').classList.add('active');$('autoBtn').setAttribute('aria-pressed','true');$('pauseLabel').textContent='หยุดเวลา';$('pauseBtn').disabled=false;
    refreshUI();renderLog();showToast(`命运已启 · ${state.character.cn} 的一生开始了`);
    startMusic();startTicker();window.scrollTo({top:0,behavior:'smooth'});
  }
  function addLog(tag,title,description){
    state.log.unshift({age:state.age,tag,title,description});if(state.log.length>70)state.log.length=70;
  }
  function stageName(age){if(age<1)return'แรกเกิด';if(age<7)return'วัยเยาว์';if(age<13)return'วัยเรียน';if(age<18)return'วัยแรกรุ่น';if(age<30)return'วัยหนุ่มสาว';if(age<45)return'วัยสร้างตัว';if(age<60)return'วัยกลางคน';if(age<75)return'วัยชรา';return'บั้นปลายชีวิต';}
  function currentRank(){
    const {origin}=state.character;const {fame,knowledge,wealth}=state.stats;const age=state.age;
    if(origin.tier==='ราชสกุล') return fame>55?'องค์ชาย / องค์หญิงในราชสำนัก':'เชื้อพระวงศ์';
    if(origin.tier==='สกุลขุนนาง') return fame>62?'ขุนนางชั้นสูง':fame>39?'ขุนนางท้องถิ่น':'บุตรขุนนาง';
    if(knowledge>=64&&fame>=40) return age<30?'บัณฑิตสอบผ่าน':'ขุนนางผู้ทรงความรู้';
    if(fame>=65) return 'ผู้มีชื่อเสียงในแคว้น';
    if(wealth>=75) return 'คหบดีผู้มั่งคั่ง';
    if(knowledge>=45) return 'บัณฑิต';
    if(origin.tier==='ช่างหลวง / ช่างเมือง'&&wealth>30)return 'ช่างฝีมือมีชื่อ';
    if(origin.tier==='เรือนพาณิชย์'&&wealth>36)return 'พ่อค้าผู้มั่นคง';
    return age<15?'สามัญชน':'สามัญชน';
  }
  function refreshUI(){
    if(!state.character)return;
    const {character:c,stats:s,era}=state;
    $('eraPill').textContent=era.cn;$('yearLabel').textContent=`รัชศก${state.regnal} · ปีที่ ${state.age+1}`;
    $('ageNum').textContent=state.age;$('ageStage').textContent=stageName(state.age);$('lifeProgress').style.width=`${Math.min(100,state.age/95*100)}%`;
    $('characterName').textContent=c.cn;$('genderTag').textContent=c.gender;$('characterSub').textContent=`${c.th} · ${c.temperament}`;
    $('classValue').textContent=c.origin.name;$('rankValue').textContent=currentRank();$('birthplaceValue').textContent=c.birthplace;
    $('healthValue').textContent=Math.round(s.health);$('knowledgeValue').textContent=Math.round(s.knowledge);$('fameValue').textContent=Math.round(s.fame);
    $('wealthValue').textContent=Math.round(s.wealth);$('bondValue').textContent=Math.round(s.bond);
    $('healthBar').style.width=`${clamp(s.health)}%`;$('knowledgeBar').style.width=`${clamp(s.knowledge)}%`;$('fameBar').style.width=`${clamp(s.fame)}%`;
    $('actionYear').textContent=`年 · ${String(state.age+1).padStart(2,'0')}`;
    $('runStateText').textContent=state.paused?'หยุดพักชั่วคราว':'กาลเวลากำลังไหล';
    $('pauseLabel').textContent=state.paused?'เดินเวลาต่อ':'หยุดเวลา';$('pauseBtn').querySelector('.pause-symbol').textContent=state.paused?'▶':'Ⅱ';
    $('controlHint').textContent=state.paused?'เวลากำลังหยุดอยู่ เลือกอ่านบันทึกหรือกดเดินเวลาต่อได้ทุกเมื่อ':'ปีหนึ่งค่อย ๆ ผ่านไปในความเงียบงัน ชะตาจะตัดสินใจอัตโนมัติหากเจ้าไม่เลือกเอง';
    $('recordCount').textContent=`${state.log.length} รายการ`;
    document.querySelectorAll('.action-card').forEach(btn=>{
      const action=btn.dataset.action;
      let disabled=state.dead||state.actionUsedAge===state.age;
      if(state.age<6 && ['travel','ambition'].includes(action))disabled=true;
      if(state.age<15 && action==='ambition')disabled=true;
      if(state.age<15 && action==='travel')disabled=true;
      if(!state.dead && state.actionUsedAge!==state.age && state.age<8 && action==='study')disabled=false;
      btn.disabled=disabled;
    });
    $('autoBtn').classList.toggle('active',state.auto);$('autoBtn').setAttribute('aria-pressed',String(state.auto));
  }
  function renderLog(){
    const box=$('chronicleList');
    if(!state.log.length){box.innerHTML='<div class="empty-record">เมื่อเรื่องราวเริ่มต้น บันทึกแรกจะปรากฏที่นี่</div>';return;}
    box.innerHTML=state.log.slice(0,12).map(item=>`<div class="chronicle-item"><div class="chronicle-year">${item.age} 岁</div><div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p></div></div>`).join('');
    $('recordCount').textContent=`${state.log.length} รายการ`;
  }
  function escapeHTML(s){return String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}

  function startTicker(){stopTicker();if(!state.live||state.dead||state.paused||$('eventBackdrop').classList.contains('hidden')===false)return;state.timer=setInterval(advanceYear,Math.max(650,2450/state.speed));}
  function stopTicker(){if(state.timer){clearInterval(state.timer);state.timer=null;}}
  function advanceYear(){
    if(!state.live||state.dead||state.paused||state.currentEvent)return;
    state.age++;
    const s=state.stats;
    // Slow changes make every decision matter without making every year dramatic.
    s.health=clamp(s.health+(chance(.32)?rand(0,2):chance(.18)?-rand(1,3):0)-((state.age>55&&chance(.35))?1:0));
    if(state.age>=16&&state.age%7===0&&chance(.24))s.wealth=clamp(s.wealth+rand(-4,5),0,100);
    if(state.age>=20&&state.age%10===0)s.bond=clamp(s.bond+rand(-3,4));
    if(state.age>40&&chance(.07))s.health=clamp(s.health-rand(1,5));
    if(state.age>95 || (state.age>1&&s.health<=0)) {endLife(state.age>95?'กาลเวลาครบถ้วน':'อาการเจ็บป่วย');return;}
    const deathChance=mortalityChance(state.age,s.health);
    if(chance(deathChance)){endLife(state.age<12?'โรคภัยในวัยเยาว์':state.age<50?'อุบัติเหตุหรือโรคภัย':'วัยชรา');return;}
    refreshUI();
    if(milestones[state.age]&&!state.playedMilestones.includes(state.age)){
      state.playedMilestones.push(state.age);openEvent(milestones[state.age]);return;
    }
    if(state.age>7&&state.age-state.lastEventAge>=3&&chance(state.age<18?.07:.1)){
      const ev={...pick(randomEvents)};openEvent(ev);return;
    }
    if(state.age>=16&&!state.hasPartner&&chance(.012)){
      openEvent({k:'缘分',title:'การพบกันโดยไม่คาดหมาย',description:'ในงานเทศกาลหรือระหว่างเดินทาง เจ้าพบใครคนหนึ่งที่ทำให้บทสนทนาธรรมดายาวนานกว่าที่คิด',choices:[
        {label:'เปิดใจทำความรู้จัก',sub:'สายสัมพันธ์อาจเติบโต',fx:{bond:10,health:2},marry:true},
        {label:'เป็นเพื่อนกันก่อน',sub:'ค่อย ๆ สร้างความไว้วางใจ',fx:{bond:6,fame:2}},
        {label:'กล่าวลาอย่างสุภาพ',sub:'เดินตามทางของตนเอง',fx:{knowledge:2}}
      ]});return;
    }
    if(state.age>=16&&state.age%9===0&&state.stats.fame>35&&chance(.45)){
      state.stats.fame=clamp(state.stats.fame+3);addLog('仕途','ได้รับการยอมรับ','ความพยายามตลอดหลายปีทำให้ผู้คนเริ่มยอมรับในฝีมือของเจ้า');
    }
    refreshUI();renderLog();
  }
  function mortalityChance(age,health){
    let base=age<1?.025:age<5?.006:age<13?.002:age<25?.0015:age<40?.0025:age<55?.006:age<65?.018:age<75?.04:age<85?.085:age<92?.16:.24;
    base+=Math.max(0,55-health)*.0011;
    return Math.min(.6,base);
  }
  function openEvent(event){
    if(!state.live||state.dead)return;
    stopTicker();state.paused=true;state.currentEvent=event;state.lastEventAge=state.age;state.autoRemain=7;
    $('eventKicker').textContent=event.k||'เหตุการณ์แห่งชะตา';$('eventTitle').textContent=event.title;$('eventDescription').textContent=event.description;$('eventAge').textContent=`${stageName(state.age)} · ${state.age} ปี`;
    $('eventChoices').innerHTML=event.choices.map((c,i)=>`<button class="event-choice" data-choice="${i}"><span>${escapeHTML(c.label)}<small>${escapeHTML(c.sub||'ทุกการตัดสินใจมีผลต่อชีวิต')}</small></span><i aria-hidden="true">›</i></button>`).join('');
    $('eventChoices').querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>resolveEvent(Number(btn.dataset.choice),false)));
    $('eventAutoNote').classList.toggle('hidden',!state.auto);$('eventBackdrop').classList.remove('hidden');refreshUI();
    if(state.auto){state.eventCountdownTimer=setInterval(()=>{state.autoRemain--;const n=$('autoCountdown');if(n)n.textContent=Math.max(0,state.autoRemain);if(state.autoRemain<=0)resolveEvent(rand(0,event.choices.length-1),true);},1000);}
  }
  function closeEvent(){if(state.eventCountdownTimer){clearInterval(state.eventCountdownTimer);state.eventCountdownTimer=null;}state.currentEvent=null;$('eventBackdrop').classList.add('hidden');}
  function resolveEvent(choiceIndex,automatic){
    const event=state.currentEvent;if(!event)return;
    if(state.eventCountdownTimer){clearInterval(state.eventCountdownTimer);state.eventCountdownTimer=null;}
    const choice=event.choices[choiceIndex]||event.choices[0];
    applyEffects(choice.fx||{});
    if(choice.marry&&!state.hasPartner){state.hasPartner=true;state.children=chance(.65)?rand(1,3):0;state.stats.bond=clamp(state.stats.bond+5);}
    if(choice.requires==='study'&&state.stats.knowledge<18){state.stats.fame=clamp(state.stats.fame-2);}
    addLog(event.k||'抉择',event.title,`${choice.label}。${choice.sub||''}${automatic?'（ชะตาอัตโนมัติเป็นผู้เลือก）':''}`);
    closeEvent();state.paused=false;
    $('actionFeedback').textContent=`ชะตาขยับไปอีกทางหนึ่ง · ${choice.label}`;
    refreshUI();renderLog();startTicker();
  }
  function applyEffects(fx){for(const [key,v] of Object.entries(fx)){if(!(key in state.stats))continue;state.stats[key]=clamp(state.stats[key]+(typeof v==='number'?v:0),0,100);}}

  function performAction(action){
    if(!state.live||state.dead||state.actionUsedAge===state.age)return;
    const age=state.age;let title='',desc='';
    if(action==='study'){
      const gain=rand(5,10)+(state.character.origin.tier==='บัณฑิต'?2:0);state.stats.knowledge=clamp(state.stats.knowledge+gain);state.stats.wealth=clamp(state.stats.wealth-rand(0,3));title='อ่านตำราและฝึกคัดอักษร';desc=`ความรู้เพิ่มขึ้น ${gain} แต้ม เวลาที่ใช้กับตำราช่วยเปิดประตูบางบานในอนาคต`;
    }else if(action==='work'){
      const gain=rand(4,10)+(state.character.origin.tier==='เรือนพาณิชย์'?3:0);state.stats.wealth=clamp(state.stats.wealth+gain);state.stats.health=clamp(state.stats.health-rand(0,2));title='ทำงานเก็บหอมรอมริบ';desc=`ทรัพย์สินเพิ่มขึ้น ${gain} ตำลึง แม้จะเหน็ดเหนื่อยแต่ฐานะค่อย ๆ มั่นคง`;
    }else if(action==='social'){
      const bond=rand(5,10);state.stats.bond=clamp(state.stats.bond+bond);if(chance(.35))state.stats.fame=clamp(state.stats.fame+2);title='ไปเยี่ยมเยียนคนรู้จัก';desc=`สายสัมพันธ์แน่นแฟ้นขึ้น ${bond} แต้ม ผู้คนย่อมช่วยเหลือกันในยามจำเป็น`;
    }else if(action==='rest'){
      const gain=rand(6,12);state.stats.health=clamp(state.stats.health+gain);title='พักผ่อนและบำรุงร่างกาย';desc=`สุขภาพฟื้นตัว ${gain} แต้ม วันนี้เจ้าปล่อยให้ใจและกายได้หยุดพัก`;
    }else if(action==='travel'){
      const outcome=chance(.64);if(outcome){state.stats.knowledge=clamp(state.stats.knowledge+rand(3,8));state.stats.fame=clamp(state.stats.fame+rand(1,5));state.stats.wealth=clamp(state.stats.wealth-rand(1,6));title='ออกเดินทางสู่เมืองอื่น';desc='การเดินทางเปิดให้เห็นผู้คนและวิถีชีวิตใหม่ ได้ทั้งความรู้และบทเรียนที่ไม่มีในตำรา';}else{state.stats.health=clamp(state.stats.health-rand(3,9));state.stats.wealth=clamp(state.stats.wealth-rand(2,6));title='อุปสรรคระหว่างทาง';desc='เส้นทางไม่ราบรื่นนัก อากาศและความเหน็ดเหนื่อยทำให้ต้องเสียทรัพย์และกำลัง';}
    }else if(action==='ambition'){
      if(state.stats.knowledge+rand(0,25)>=42){state.stats.fame=clamp(state.stats.fame+rand(6,12));state.stats.wealth=clamp(state.stats.wealth+rand(2,7));title='โอกาสในเส้นทางรับราชการ';desc='ความรู้และความพากเพียรได้รับการมองเห็น ชื่อเสียงของเจ้าเริ่มขยับสูงขึ้น';}else{state.stats.knowledge=clamp(state.stats.knowledge+rand(2,5));state.stats.health=clamp(state.stats.health-rand(1,4));title='การสอบที่ยังไม่สำเร็จ';desc='ครั้งนี้ยังไม่เป็นดั่งใจ แต่ความพยายามทำให้เจ้าเข้าใจสิ่งที่ต้องฝึกฝนมากขึ้น';}
    }
    state.actionUsedAge=age;addLog('抉择',title,desc);$('actionFeedback').textContent=`${title} · การตัดสินใจครั้งนี้ถูกบันทึกไว้แล้ว`;
    refreshUI();renderLog();
  }

  function endLife(reason){
    if(state.dead)return;stopTicker();closeEvent();state.dead=true;state.live=false;state.paused=true;state.stats.health=clamp(state.stats.health);
    addLog('终','ชีวิตเดินทางถึงหน้าสุดท้าย',`${state.character.th} จากไปเมื่ออายุ ${state.age} ปี · ${reason}`);refreshUI();renderLog();
    $('endTitle').textContent=state.age>=80?'ชีวิตยืนยาวดั่งสายน้ำ':'ทุกชีวิตย่อมมีปลายทาง';
    $('endSummary').textContent=`${state.character.cn} (${state.character.th}) มีชีวิตอยู่ ${state.age} ปี ใน${state.era.th} จากเด็กคนหนึ่งสู่เรื่องราวที่ไม่อาจเกิดซ้ำ ชีวิตนี้สิ้นสุดลงเพราะ${reason} แต่ร่องรอยที่ฝากไว้ยังคงอยู่ในบันทึก`;
    $('endStats').innerHTML=`ฐานะสุดท้าย: <strong>${escapeHTML(currentRank())}</strong><br>สุขภาพ ${Math.round(state.stats.health)} · ความรู้ ${Math.round(state.stats.knowledge)} · ชื่อเสียง ${Math.round(state.stats.fame)}<br>ทรัพย์สิน ${Math.round(state.stats.wealth)} ตำลึง · สายสัมพันธ์ ${Math.round(state.stats.bond)}${state.hasPartner?`<br>มีคู่ครอง${state.children?` · บุตร ${state.children} คน`:''}`:''}`;
    $('lifeEnd').classList.remove('hidden');saveCompletedLife(reason);$('runStateText').textContent='ชีวิตนี้สิ้นสุดแล้ว';$('pauseBtn').disabled=true;showToast('ชีวิตนี้ได้กลายเป็นบันทึกในกาลเวลาแล้ว');setTimeout(()=> $('lifeEnd').scrollIntoView({behavior:'smooth',block:'center'}),250);
  }
  function saveCompletedLife(reason){
    if(state.saved)return;state.saved=true;
    const entries=getArchives();entries.unshift({id:`${Date.now()}-${Math.random().toString(16).slice(2,6)}`,name:state.character.cn,th:state.character.th,gender:state.character.gender,age:state.age,era:state.era.th,eraCn:state.era.cn,origin:state.character.origin.name,rank:currentRank(),health:Math.round(state.stats.health),knowledge:Math.round(state.stats.knowledge),fame:Math.round(state.stats.fame),wealth:Math.round(state.stats.wealth),bond:Math.round(state.stats.bond),reason,date:new Date().toISOString(),log:state.log.slice(0,50)});
    try{localStorage.setItem('shanhe-archives-v1',JSON.stringify(entries.slice(0,30)));}catch(e){console.warn('Could not save archive',e);}
  }
  function getArchives(){try{return JSON.parse(localStorage.getItem('shanhe-archives-v1')||'[]')}catch{return[]}}
  function showArchives(){
    const entries=getArchives();const box=$('archiveList');
    if(!entries.length){box.innerHTML='<div class="archive-empty">ยังไม่มีชาติก่อนให้ย้อนรำลึก เมื่อชีวิตหนึ่งเดินทางถึงปลายทาง บันทึกจะปรากฏที่นี่</div>';}
    else box.innerHTML=entries.map(e=>`<div class="archive-entry"><div><strong>${escapeHTML(e.name)} <span style="font-family:var(--sans);font-weight:400;color:#9c8a70;font-size:10px">${escapeHTML(e.th)}</span></strong><p>${escapeHTML(e.era)} · อายุ ${e.age} ปี · ${escapeHTML(e.rank)}</p></div><button data-archive-id="${escapeHTML(e.id)}">อ่านบันทึก</button></div>`).join('');
    box.querySelectorAll('[data-archive-id]').forEach(btn=>btn.addEventListener('click',()=>{const item=getArchives().find(e=>e.id===btn.dataset.archiveId);if(item){showToast(`${item.name} · อายุ ${item.age} ปี · ${item.reason}`);}}));
    $('archivePanel').classList.remove('hidden');
  }
  function exportArchive(){
    const pack={app:'山河浮生 · ชะตาใต้หล้า',exportedAt:new Date().toISOString(),currentLife:state.character?{name:state.character.cn,thaiName:state.character.th,age:state.age,era:state.era?.th,stats:state.stats,chronicle:state.log}:null,completedLives:getArchives()};
    const blob=new Blob([JSON.stringify(pack,null,2)],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='shanhe-life-chronicle.json';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);showToast('ส่งออกบันทึกชีวิตแล้ว');
  }
  function showToast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600);}

  // Original, synthesized guqin-inspired ambience. No external music recording is used.
  function startMusic(){
    if(musicOn)return;
    const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx){showToast('เบราว์เซอร์นี้ไม่รองรับเสียงดนตรี');return;}
    try{audioCtx=audioCtx||new Ctx();if(audioCtx.state==='suspended')audioCtx.resume();musicOn=true;$('musicBtn').style.color='var(--red)';$('musicBtn').style.borderColor='#d4b6a1';scheduleMusic();}catch(err){musicOn=false;console.warn(err);}
  }
  function stopMusic(){musicOn=false;if(musicTimer){clearTimeout(musicTimer);musicTimer=null;}if($('musicBtn')){$('musicBtn').style.color='';$('musicBtn').style.borderColor='';}}
  function scheduleMusic(){
    if(!musicOn||!audioCtx)return;
    const note=soundNotes[musicStep%soundNotes.length];musicStep++;
    pluck(note,audioCtx.currentTime);
    if(musicStep%4===0&&chance(.7))pluck(note/2,audioCtx.currentTime+.04,.35);
    musicTimer=setTimeout(scheduleMusic,rand(1650,2450));
  }
  function pluck(freq,when,volume=0.16){
    if(!audioCtx||!musicOn)return;
    const out=audioCtx.createGain();out.gain.setValueAtTime(.0001,when);out.gain.exponentialRampToValueAtTime(volume,when+.025);out.gain.exponentialRampToValueAtTime(.0001,when+2.1);out.connect(audioCtx.destination);
    const osc=audioCtx.createOscillator();osc.type='triangle';osc.frequency.setValueAtTime(freq,when);osc.detune.setValueAtTime(rand(-4,4),when);const filter=audioCtx.createBiquadFilter();filter.type='lowpass';filter.frequency.setValueAtTime(1900,when);filter.frequency.exponentialRampToValueAtTime(500,when+1.8);osc.connect(filter);filter.connect(out);osc.start(when);osc.stop(when+2.15);
    const overtone=audioCtx.createOscillator();overtone.type='sine';overtone.frequency.setValueAtTime(freq*2.01,when);const og=audioCtx.createGain();og.gain.setValueAtTime(.0001,when);og.gain.exponentialRampToValueAtTime(volume*.22,when+.02);og.gain.exponentialRampToValueAtTime(.0001,when+.65);overtone.connect(og);og.connect(audioCtx.destination);overtone.start(when);overtone.stop(when+.7);
  }

  $('birthBtn').addEventListener('click',startLife);$('newLifeBtn').addEventListener('click',startLife);$('backToStartBtn').addEventListener('click',()=>{stopTicker();stopMusic();closeEvent();state.live=false;$('lifeScreen').classList.add('hidden');$('startScreen').classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});});
  $('pauseBtn').addEventListener('click',()=>{if(!state.live||state.dead||state.currentEvent)return;state.paused=!state.paused;if(state.paused)stopTicker();else startTicker();refreshUI();});
  document.querySelectorAll('.speed-btn').forEach(btn=>btn.addEventListener('click',()=>{state.speed=Number(btn.dataset.speed)||1;document.querySelectorAll('.speed-btn').forEach(b=>b.classList.toggle('active',b===btn));if(state.live&&!state.paused&&!state.currentEvent)startTicker();}));
  $('autoBtn').addEventListener('click',()=>{state.auto=!state.auto;$('autoBtn').classList.toggle('active',state.auto);$('autoBtn').setAttribute('aria-pressed',String(state.auto));if(state.currentEvent){if(state.auto){$('eventAutoNote').classList.remove('hidden');state.autoRemain=7;$('autoCountdown').textContent='7';state.eventCountdownTimer=setInterval(()=>{state.autoRemain--;if($('autoCountdown'))$('autoCountdown').textContent=Math.max(0,state.autoRemain);if(state.autoRemain<=0)resolveEvent(rand(0,state.currentEvent.choices.length-1),true);},1000);}else{if(state.eventCountdownTimer){clearInterval(state.eventCountdownTimer);state.eventCountdownTimer=null;}$('eventAutoNote').classList.add('hidden');}}showToast(state.auto?'เปิดการตัดสินใจอัตโนมัติ':'ปิดการตัดสินใจอัตโนมัติ · เลือกเหตุการณ์ด้วยตนเอง');});
  document.querySelectorAll('.action-card').forEach(btn=>btn.addEventListener('click',()=>performAction(btn.dataset.action)));
  $('revealBtn').addEventListener('click',()=>{const panel=$('originDetail');const open=panel.classList.contains('hidden');panel.classList.toggle('hidden',!open);$('revealBtn').classList.toggle('open',open);if(open&&state.character){const c=state.character;panel.textContent=`${c.fateLine} · ${c.origin.detail} · นิสัยเด่น: ${c.temperament} · สภาพร่างกายแรกเกิด ${c.healthAtBirth}/100`;}});
  $('musicBtn').addEventListener('click',()=>{if(musicOn)stopMusic();else startMusic();showToast(musicOn?'เปิดเสียงบรรเลงแนวจีน':'ปิดเสียงดนตรี');});
  $('archiveBtn').addEventListener('click',showArchives);$('closeArchiveBtn').addEventListener('click',()=>$('archivePanel').classList.add('hidden'));$('exportBtn').addEventListener('click',exportArchive);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(state.timer)stopTicker();}else if(state.live&&!state.dead&&!state.paused&&!state.currentEvent)startTicker();});

  // Use the browser's native share/download-free interface without a server dependency.
  if('serviceWorker' in navigator && location.protocol.startsWith('http')){
    window.addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js').catch(()=>{});});
  }
})();
