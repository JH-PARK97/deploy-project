    // 즉시호출 함수로 arrow 함수 선언. 화살표함수의 값을 바로 호출 
    // Object로 만들려면 전체 Application에서 유일한 코드여야 한다.
    // 한번만 실행되며, 다시 호출 할 수 없도록 한다

(()=>{ 

    // 스크롤 값
    let yOffset = 0;
    
    // 현재 보여지는 section(section-0)
    let currentSection = 0;

    // 이전 section의 height 값
    let prevSectionHeight = 0;

    // 현재 section의 YOffset 값
    let sectionYOffset = 0;


    const sectionSet = [
        

        // section-0
        { 
            // section의 구분값 (sticky : 글자 위치가 고정된 스크롤에 반응하는 섹션)
            //                   normal : 일반적인 스크롤 섹션                                
            type : 'sticky',

            // height = 스크롤의 높이, 초기화 함수에서 화면 구성에 따라 비율로 설정. 
            // 0인 이유는 Browser의 정보가 바뀔 수 있기 때문이다.(크기)
            // 비율로 표현하는 게 더 좋다. 고정하면 유연성이 떨어진다.
            height : 0,

            // multiple : 스크롤 높이를 설정하기 위한 배수
            multiple : 4,

            // section에서 사용하는 document object(element)들을 저장.
            objs :  {

                container    : document.querySelector('#section-0'),
                container1   : document.querySelector('#section-1'),
                container2   : document.querySelector('#section-2'),

                text         : document.querySelector('.text'),

                MessageA     : document.querySelector('#section-0 .message.a'),
                MessageB     : document.querySelector('#section-0 .message.b'),
                MessageC     : document.querySelector('#section-0 .message.c'),

                mainCanvas   : document.querySelector('#main-canvas'),
                context      : document.querySelector('#main-canvas').getContext('2d'),
                canvasImages : [],

            },

            // section에서 사용하는 모든 값들을 저장.
            values : {

                imageCount    : 614,
                imageSequence : [0, 613],

                text_opacity_in          : [1, 0,     {start : 0.00, end : 0.04}],
                image_out                : [0, 1,     {start : 0.00, end : 0.04}],

                messageA_opacity_out     : [0, 1,     {start : 0.05, end : 0.15}],
                messageA_translateY_out  : [0, -20,   {start : 0.05, end : 0.15}],
        
                messageA_opacity_in      : [1, 0,     {start : 0.15, end : 0.25}],
                messageA_translateY_in   : [-20, -40, {start : 0.15, end : 0.25}],

                messageB_opacity_out     : [0, 1,     {start : 0.35, end : 0.45}],
                messageB_translateY_out  : [0, -20,   {start : 0.35, end : 0.45}],
        
                messageB_opacity_in      : [1, 0,     {start : 0.45, end : 0.55}],
                messageB_translateY_in   : [-20, -40, {start : 0.45, end : 0.55}],

                messageC_opacity_out     : [0, 1,     {start : 0.65, end : 0.75}],
                messageC_translateY_out  : [0, -20,   {start : 0.65, end : 0.75}],
        
                messageC_opacity_in      : [1, 0,     {start : 0.75, end : 0.85}],
                messageC_translateY_in   : [-20, -40, {start : 0.75, end : 0.85}],  
                
                image_in                 : [1, 0,     {start : 0.90, end : 1}]

            }            
        },

        // section-1
        {

            type : 'normal',
            height : 0,
            multiple : 4,

            objs :  {

                container   : document.querySelector('#section-1'),
                navBar      : document.querySelector('.local-nav')

            },

            values : {

                section_1_opacity_out : [0, 1, {start : 0.01, end : 0.05}]

            }       
        },

        // section-2
        {

            type : 'sticky',
            height : 0,
            multiple : 0.25,

            objs :  {

                container : document.querySelector('#section-2'),

            }
        }
    ];


// -----------------------------------------------------------------------------------------------------------------
//  함수 파트 
// -----------------------------------------------------------------------------------------------------------------

    // 새로고침 시 스크롤을 최상단으로 이동하는 함수
    window.onload = function()
    {
        setTimeout(function() {

        scrollTo(0,0),100;

        });
    }

    // 메인 페이지 로딩시 출력되는 문구에 타이핑 효과 추가

    const typingEffect = function()
    {
        const content = "Welcome to JH's Home !";   // 사용할 문구
        const text = sectionSet[currentSection].objs.text;
        let index = 0; 

        const typing = function() 
        {
            text.textContent = text.textContent + content[index++];
            if (index > content.length)
            {
               text.textContent = "";
                index = 0;
            }
        }

        setInterval(typing, 200);
    }

    typingEffect();


    //sectionSet 배열을 초기화 해주는 함수.
    const initSectionSet = function()
    { 
        for(let i = 0; i < sectionSet.length; i++)
        {                      
            // 높이를 설정한다. ==> 기본 높이의 4배(multiple)
            sectionSet[i].height = window.innerHeight * sectionSet[i].multiple;
        
            // 설정한 높이를 실제로 적용한다. document-element의 속성을 바꾼다.
            sectionSet[i].objs.container.style.height = `${sectionSet[i].height}px`; 
        }

        // 이미지를 불러온다.
        let elmImage = null;

        for (let i = 0; i < sectionSet[0].values.imageCount; i++)
        {
            elmImage = new Image();
            elmImage.src = `./img/star${i}.jpg`;
            sectionSet[0].objs.canvasImages.push(elmImage);
        }
    }



    // yOffset에 따라 현재 보고있는 Section을 설정한다.
    // 스크롤 시에 수행되는 함수
    const getCurrentSection = function()
    {
        let result = 0;
        
        if (yOffset <= sectionSet[0].height)
        {
            result = 0;
        }

        else if ((yOffset > sectionSet[0].height) && 
                 (yOffset < sectionSet[0].height + sectionSet[1].height))
        {
            result = 1;            
        }

        else if (yOffset > sectionSet[0].height + sectionSet[1].height)
        {
            result = 2;
        }

        return result;

    }


    // 현재 section의 위쪽 section의 높이 합을 구한다.
    const getPrevSectionHeight = function()
    {
        let result = 0;

        for (let i = 0; i < currentSection; i++)

        {                  
            result = result + sectionSet[i].height;
        }

        return result;

    }

        // 최초에 HTML Page를 초기화하는 함수.
        const initHTMLPage = function()
        {
            // sectionSet을 초기화한다.
            initSectionSet();
        }


   // sectionYOffset의 위치를 판단해서
   // 파라미터로 들어온 values의 범위 내에 적당한 값을 리턴한다.

        const calcValue = function(values)
        {          
            let rate      =  0;   // 원본의 비율
            let result    =  0;   // 리턴되는 값 (최소값 + 비율)
            
            let partStart  = 0;   // start의 실제 offset 값.
            let partEnd    = 0;   // end의 실제 offset 값.
            let partHeight = 0;   // part의 길이

            const sectionHeight =  sectionSet[currentSection].height;
            const range         =  values[1] - values[0];



            // [0, 1, {start, end}]
            if (values.length === 3)
            {
               partStart  = sectionHeight * values[2].start;
               partEnd    = sectionHeight * values[2].end;
               partHeight = partEnd - partStart;   
               
               if ((sectionYOffset >= partStart) && (sectionYOffset <= partEnd))
               {
                   // 1. 비율. 얼마나 갔는지.
                   rate = (sectionYOffset - partStart) / partHeight;
                   result = (rate * range) + values[0];

               }

               else if (sectionYOffset < partStart)
               {
                   result = values[0];
               }

               else if (sectionYOffset > partEnd)
               {
                   result = values[1];
               }
            }
            else
            {
                rate = sectionYOffset / sectionHeight;
                result = (range * rate) + values[0];            
            }
                return result; 
 
        }
       


        const playAnimation = function() 
        {
            let opacityValue   =  0;
            let translateValue =  0;
            let imageIndex     =  0;

            const cs =  sectionSet[currentSection];
            const offsetRate = sectionYOffset / cs.height;


            switch(currentSection)
            {
                // 1. 스크롤 값을 기반으로 opacity 범위를 계산한다.
                // 2. CSS에 적용한다.

                case 0 :         

                 // 이미지인덱스가 0 ~ 613까지 나오는게 목표.
                 // calcValue가 현재 yOffSet에 따라 해당하는 Index값 리턴. (0부터 613까지)
                  imageIndex = Math.floor(calcValue(cs.values.imageSequence)) 
                  cs.objs.context.drawImage(cs.objs.canvasImages[imageIndex], 0, 0); 
                
                if (offsetRate < 0.05)
                {   
                    
                    opacityValue     = calcValue(cs.values.text_opacity_in);
                    img_opacityValue = calcValue(cs.values.image_out);

                    cs.objs.text.style.opacity = `${opacityValue}`;

                    cs.objs.MessageA.style.opacity = '0';
                    cs.objs.MessageB.style.opacity = '0';
                    cs.objs.MessageC.style.opacity = '0';

                    cs.objs.mainCanvas.style.opacity = `${img_opacityValue}`;
                }

                else if ((offsetRate > 0.05) && (offsetRate <= 0.15))
                {
                    opacityValue   = calcValue(cs.values.messageA_opacity_out);
                    translateValue = calcValue(cs.values.messageA_translateY_out);

                    cs.objs.MessageA.style.opacity   = `${opacityValue}`;
                    cs.objs.MessageA.style.transform = `translateY(${translateValue}%)`;
                }

                else if ((offsetRate > 0.15) && (offsetRate <= 0.25))
                {
                    opacityValue   = calcValue(cs.values.messageA_opacity_in);
                    translateValue = calcValue(cs.values.messageA_translateY_in);

                    cs.objs.MessageA.style.opacity   = `${opacityValue}`;
                    cs.objs.MessageA.style.transform = `translateY(${translateValue}%)`;
                }

                else if ((offsetRate > 0.25) && (offsetRate < 0.35))
                {
                    cs.objs.MessageA.style.opacity = '0';
                    cs.objs.MessageB.style.opacity = '0';
                    cs.objs.MessageC.style.opacity = '0';
                }

                else if ((offsetRate >= 0.35) && (offsetRate <= 0.45))
                {
                    opacityValue   = calcValue(cs.values.messageB_opacity_out);
                    translateValue = calcValue(cs.values.messageB_translateY_out);

                    cs.objs.MessageB.style.opacity   = `${opacityValue}`;
                    cs.objs.MessageB.style.transform = `translateY(${translateValue}%)`;
                }
                
                else if ((offsetRate > 0.45) && (offsetRate <= 0.55))
                {
                    opacityValue   = calcValue(cs.values.messageB_opacity_in);
                    translateValue = calcValue(cs.values.messageB_translateY_in);

                    cs.objs.MessageB.style.opacity   = `${opacityValue}`;
                    cs.objs.MessageB.style.transform = `translateY(${translateValue}%)`;
                }


                else if ( (offsetRate > 0.55) && (offsetRate < 0.65) )
                {
                    cs.objs.MessageA.style.opacity = '0';
                    cs.objs.MessageB.style.opacity = '0';
                    cs.objs.MessageC.style.opacity = '0';
                }


                else if ( (offsetRate >= 0.65) && (offsetRate <= 0.75) )
                {
                    opacityValue   = calcValue(cs.values.messageC_opacity_out);
                    translateValue = calcValue(cs.values.messageC_translateY_out);

                    cs.objs.MessageC.style.opacity   = `${opacityValue}`;
                    cs.objs.MessageC.style.transform = `translateY(${translateValue}%)`;
                }

                else if ( (offsetRate > 0.75) && (offsetRate <= 0.85) )
                {
                    opacityValue   = calcValue(cs.values.messageC_opacity_in);
                    translateValue = calcValue(cs.values.messageC_translateY_in);

                    cs.objs.MessageC.style.opacity   = `${opacityValue}`;
                    cs.objs.MessageC.style.transform = `translateY(${translateValue}%)`;                                   
                    
                }                
                
                else
                {                    
                    img_opacityValue  = calcValue(cs.values.image_in);
                    cs.objs.mainCanvas.style.opacity = `${img_opacityValue}`;


                    cs.objs.MessageA.style.opacity = '0';
                    cs.objs.MessageB.style.opacity = '0';
                    cs.objs.MessageC.style.opacity = '0'; 
                      
                }       
                
                        break;

                case 1 :                  
                   
                    if (offsetRate < 0.05)
                    {
                        cs.objs.navBar.style.display = 'block';   
                    }
                        opacityValue  = calcValue(cs.values.section_1_opacity_out);
                        
                        cs.objs.container.style.opacity  = `${opacityValue}`;

                        break;
            }
        }






        // 스크롤시에 수행되는 함수

        const scrollLoop = function()
        {
            // currentSection에 따른 CSS값을 설정한다.
            // body에 id 를 show-section으로 넣어준다
            document.body.setAttribute('id', `show-section-${currentSection}`);

            // 내가 지금 보고있는 section이 어디인지 판별 가능.
            // 그러므로 그에 해당하는 Animation을 실행한다.
            // 해당 currentSection에서 실행 할 애니메이션을 설정한다.

            // scroll 될 때 마다 scrollLoop가 실행되므로 playAnimation도 실행.
            playAnimation(); 

        }

        

    

// -----------------------------------------------------------------------------------------------------------------
//  이벤트 핸들러 
// -----------------------------------------------------------------------------------------------------------------

    window.addEventListener('scroll', ()=> {

        yOffset             =  window.scrollY;                  // 스크롤 값 (yOffset)
        currentSection      =  getCurrentSection();             // 현재 섹션 (currentSection)
        prevSectionHeight   =  getPrevSectionHeight();          // 이전 섹션의 높이 (prevSectionHeight)
        sectionYOffset      =  yOffset - prevSectionHeight      // 현재 섹션내에서의 스크롤 값 (sectionYOffset)

        //  console.log('현재 섹션값 = ' + currentSection + '스크롤 값 = ' 
        //              + yOffset + '현재 섹션의 스크롤 값' + sectionYOffset);

        scrollLoop(); // scroll이 발생 할 때 마다 scrollLoop 실행

    });
    
 
    document.addEventListener('DOMContentLoaded',()=> {

        

        const menu_home    = document.querySelector('#menu_home');
        const menu_aboutme = document.querySelector('#menu_about_me');
        const menu_skills  = document.querySelector('#menu_skills');
        const menu_project = document.querySelector('#menu_project');
        const menu_contact = document.querySelector('#menu_contact');


        const aboutme      = document.querySelector('.cls_AboutMe');
        const skills       = document.querySelector('.cls_Skills');
        const project      = document.querySelector('.cls_Project');
        const contact      = document.querySelector('.cls_Contact');


        menu_home.addEventListener('click',(event) => {

            location.reload(true);
            event.preventDefault();

        });


        menu_aboutme.addEventListener('click',(event) => {

            aboutme.scrollIntoView({behavior:'smooth'});
            event.preventDefault();

        });


        menu_skills.addEventListener('click',(event) => {

            skills.scrollIntoView({behavior:'smooth'});
            event.preventDefault();

        });


        menu_project.addEventListener('click',(event) => {

            project.scrollIntoView({behavior:'smooth'});
            event.preventDefault();

        });


        menu_contact.addEventListener('click',(event) => {

            contact.scrollIntoView({behavior:'smooth'});
            event.preventDefault();

        });

    });

    window.addEventListener('load', ()=> {

        initHTMLPage();    
  
  
      });    

})();