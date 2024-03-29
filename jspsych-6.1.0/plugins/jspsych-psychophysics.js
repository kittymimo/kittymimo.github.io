/**
 * jspsych-psychophysics
 * Copyright (c) 2019 Daiichiro Kuroki
 * Released under the MIT license
 * 
 * jspsych-psychophysics is a plugin for conducting Web-based psychophysical experiments using jsPsych (de Leeuw, 2015). 
 *
 * http://jspsychophysics.hes.kyushu-u.ac.jp/
 *
 **/

 /* global jsPsych */

jsPsych.plugins["psychophysics"] = (function() {
  console.log('jspsych-psychophysics Version 1.4.2')

  let plugin = {};

  plugin.info = {
    name: 'psychophysics',
    description: '',
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.COMPLEX, // This is similar to the quesions of the survey-likert. 
        array: true,
        pretty_name: 'Stimuli',
        description: 'The objects will be presented in the canvas.',
        nested: {
          startX: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'startX',
            default: 'center',
            description: 'The horizontal start position.'
          },
          startY: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'startY',
            default: 'center',
            description: 'The vertical start position.'
          },
          endX: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'endX',
            default: null,
            description: 'The horizontal end position.'
          },
          endY: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'endY',
            default: null,
            description: 'The vertical end position.'
          },
          show_start_time: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Show start time',
            default: 0,
            description: 'Time to start presenting the stimuli'
          },
          show_end_time: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Show end time',
            default: null,
            description: 'Time to end presenting the stimuli'
          },
          show_start_frame: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Show start frame',
            default: 0,
            description: 'Time to start presenting the stimuli in frames'
          },
          show_end_frame: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Show end frame',
            default: null,
            description: 'Time to end presenting the stimuli in frames'
          },
          line_width: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Line width',
            default: 1,
            description: 'The line width'
          },
          lineJoin: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'lineJoin',
            default: 'miter',
            description: 'The type of the corner when two lines meet.'
          },
          miterLimit: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'miterLimit',
            default: 10,
            description: 'The maximum miter length.'
          },
          drawFunc: {
            type: jsPsych.plugins.parameterType.FUNCTION,
            pretty_name: 'Draw function',
            default: null,
            description: 'This function enables to move objects horizontally and vertically.'
          },
          change_attr: {
            type: jsPsych.plugins.parameterType.FUNCTION,
            pretty_name: 'Change attributes',
            default: null,
            description: 'This function enables to change attributes of objects immediately before drawing.'
          },
          is_frame: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'time is in frames',
            default: false,
            description: 'If true, time is treated in frames.'
          },
          origin_center: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'origin_center',
            default: false,
            description: 'The origin is the center of the window.'
          },
          is_presented: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'is_presented',
            default: false,
            description: 'This will be true when the stimulus is presented.'
          },
          trial_ends_after_audio: {
            type: jsPsych.plugins.parameterType.BOOL,
            pretty_name: 'Trial ends after audio',
            default: false,
            description: 'If true, then the trial will end as soon as the audio file finishes playing.'
          },
        }
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      canvas_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Canvas width',
        default: window.innerWidth,
        description: 'The width of the canvas.'
      },
      canvas_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Canvas height',
        default: window.innerHeight,
        description: 'The height of the canvas.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },
      background_color: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Background color',
        default: 'grey',
        description: 'The background color of the canvas.'
      },
      response_type: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'key, mouse or button',
        default: 'key',
        description: 'How to make a response.'
      },
      response_start_time: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Response start',
        default: 0,
        description: 'When the subject is allowed to respond to the stimulus.'
      },
      stepFunc: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'Step function',
        default: null,
        description: 'This function enables to move objects as you wish.'        
      },
      mouse_down_func: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'Mouse down function',
        default: null,
        description: 'This function is set to the event listener of the mousedown.'        
      },
      mouse_move_func: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'Mouse move function',
        default: null,
        description: 'This function is set to the event listener of the mousemove.'        
      },
      mouse_up_func: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'Mouse up function',
        default: null,
        description: 'This function is set to the event listener of the mouseup.'        
      },
      key_down_func:{
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'Key down function',
        default: null,
        description: 'This function is set to the event listener of the keydown.'              
      },
      key_up_func:{
        type: jsPsych.plugins.parameterType.FUNCTION,
        pretty_name: 'Key up function',
        default: null,
        description: 'This function is set to the event listener of the keyup.'              
      },
      button_choices: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button choices',
        // default: undefined,
        default: ['Next'],
        array: true,
        description: 'The labels for the buttons.'
      },
      button_html: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button HTML',
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
        description: 'The html of the button. Can create own style.'
      },
      vert_button_margin: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '0px',
        description: 'The vertical margin of the button.'
      },
      horiz_button_margin: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '8px',
        description: 'The horizontal margin of the button.'
      },
      clear_canvas: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'clear_canvas',
        default: true,
        description: 'Clear the canvas per frame.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    
    const elm_jspsych_content = document.getElementById('jspsych-content');
    const style_jspsych_content = window.getComputedStyle(elm_jspsych_content); // stock
    const default_maxWidth = style_jspsych_content.maxWidth;
    elm_jspsych_content.style.maxWidth = 'none'; // The default value is '95%'. To fit the window.

    let new_html = '<canvas id="myCanvas" class="jspsych-canvas" width=' + trial.canvas_width + ' height=' + trial.canvas_height + ' style="background-color:' + trial.background_color + ';"></canvas>';

    const motion_rt_method = 'performance'; // 'date' or 'performance'. 'performance' is better.
    let start_time;
    let keyboardListener;

    // allow to respond using keyboard mouse or button
    jsPsych.pluginAPI.setTimeout(function() {
      if (trial.response_type === 'key'){
        if (trial.choices != jsPsych.NO_KEYS) {
          keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: after_response,
            valid_responses: trial.choices,
            rt_method: motion_rt_method,
            persist: false,
            allow_held_key: false
          });
        }  
      } else if (trial.response_type === 'mouse')  {

        if (motion_rt_method == 'date') {
          start_time = (new Date()).getTime();
        } else {
          start_time = performance.now();
        }

        canvas.addEventListener("mousedown", mouseDownFunc);
      } else { // button
        start_time = performance.now();
        for (let i = 0; i < trial.button_choices.length; i++) {
          display_element.querySelector('#jspsych-image-button-response-button-' + i).addEventListener('click', function(e){
            const choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
            // after_response(choice);
            // console.log(performance.now())
            // console.log(start_time)
            after_response({
              key: -1,
              rt: performance.now() - start_time,
              button: choice,
          });
    
          });
        }
      }
    }, trial.response_start_time);

    //display buttons
    if (trial.response_type === 'button'){
      let buttons = [];
      if (Array.isArray(trial.button_html)) {
        if (trial.button_html.length == trial.button_choices.length) {
          buttons = trial.button_html;
        } else {
          console.error('Error: The length of the button_html array does not equal the length of the button_choices array');
        }
      } else {
        for (let i = 0; i < trial.button_choices.length; i++) {
          buttons.push(trial.button_html);
        }
      }
      new_html += '<div id="jspsych-image-button-response-btngroup">';
      for (let i = 0; i < trial.button_choices.length; i++) {
        let str = buttons[i].replace(/%choice%/g, trial.button_choices[i]);
        new_html += '<div class="jspsych-image-button-response-button" style="display: inline-block; margin:'+trial.vert_button_margin+' '+trial.horiz_button_margin+'" id="jspsych-image-button-response-button-' + i +'" data-choice="'+i+'">'+str+'</div>';
      }
      new_html += '</div>';
  
    }
    

    // add prompt
    if(trial.prompt !== null){
      new_html += trial.prompt;
    }

    // draw
    display_element.innerHTML = new_html;


    const canvas = document.getElementById('myCanvas');
    if ( ! canvas || ! canvas.getContext ) {
      alert('This browser does not support the canvas element.');
      return;
    }
    const ctx = canvas.getContext('2d');

    trial.canvas = canvas;
    trial.context = ctx;
    
    const centerX = canvas.width/2;
    const centerY = canvas.height/2;
    
    // add event listeners defined by experimenters.
    if (trial.mouse_down_func !== null){
      canvas.addEventListener("mousedown", trial.mouse_down_func);
    }

    if (trial.mouse_move_func !== null){
      canvas.addEventListener("mousemove", trial.mouse_move_func);
    }

    if (trial.mouse_up_func !== null){
      canvas.addEventListener("mouseup", trial.mouse_up_func);
    }
    
    if (trial.key_down_func !== null){
      document.addEventListener("keydown", trial.key_down_func); // It doesn't work if the canvas is specified instead of the document.
    }

    if (trial.key_up_func !== null){
      document.addEventListener("keyup", trial.key_up_func);
    }

    if (typeof trial.stimuli === 'undefined' && trial.stepFunc === null){
      alert('You have to specify the stimuli/stepFunc parameter in the psychophysics plugin.')
      return
    }

    const set_functions = {
      sound: set_sound,
      image: set_image,
      line: set_line,
      rect: set_rect,
      circle: set_circle,
      text: set_text,
      cross: set_cross,
      manual: set_manual
    }

    function set_sound(stim){
      if (typeof stim.file === 'undefined') {
        alert('You have to specify the file property.')
        return;
      }

      // setup stimulus
      stim.context = jsPsych.pluginAPI.audioContext();
      if(stim.context !== null){
        stim.source = stim.context.createBufferSource();
        stim.source.buffer = jsPsych.pluginAPI.getAudioBuffer(stim.file);
        stim.source.connect(stim.context.destination);
        console.log('WebAudio')
      } else {
        stim.audio = jsPsych.pluginAPI.getAudioBuffer(stim.file);
        stim.audio.currentTime = 0;
        console.log('HTML5 audio')
      }

      // set up end event if trial needs it
      if(stim.trial_ends_after_audio){
        if(stim.context !== null){
          stim.source.onended = function() {
            end_trial();
          }
        } else {
          stim.audio.addEventListener('ended', end_trial);
        }
      }

      jsPsych.pluginAPI.setTimeout(function() {
        // start audio
        if(stim.context !== null){
          //startTime = stim.context.currentTime;
          stim.source.start(stim.context.currentTime);
        } else {
          stim.audio.play();
        }  
      }, stim.show_start_time);
    }

    function common_set(stim){
      // restore original values
      if (typeof stim.original_startX === 'undefined') {
        stim.original_startX = stim.startX;
      } else {
        stim.startX = stim.original_startX;
      }
      if (typeof stim.original_startY === 'undefined') {
        stim.original_startY = stim.startY;
      } else {
        stim.startY = stim.original_startY;
      }

      if (stim.startX === 'center') {
        if (stim.origin_center) {
          stim.startX = 0;
        } else {
          stim.startX = centerX;
        }
      }
      if (stim.startY === 'center') {
        if (stim.origin_center) {
          stim.startY = 0;
        } else {
          stim.startY = centerY;
        }
      }
      if (stim.endX === 'center') {
        if (stim.origin_center) {
          stim.endX = 0;
        } else {
          stim.endX = centerX;
        }
      }
      if (stim.endY === 'center') {
        if (stim.origin_center) {
          stim.endY = 0;
        } else {
          stim.endY = centerY;
        }
      }

      if (stim.origin_center) {
        stim.startX = stim.startX + centerX;
        stim.startY = stim.startY + centerY;
        if (stim.endX !== null) stim.endX = stim.endX + centerX;
        if (stim.endY !== null) stim.endY = stim.endY + centerY;
      }

      if (typeof stim.motion_start_time === 'undefined') stim.motion_start_time = stim.show_start_time; // Motion will start at the same time as it is displayed.
      if (typeof stim.motion_end_time === 'undefined') stim.motion_end_time = null;
      if (typeof stim.motion_start_frame === 'undefined') stim.motion_start_frame = stim.show_start_frame; // Motion will start at the same frame as it is displayed.
      if (typeof stim.motion_end_frame === 'undefined') stim.motion_end_frame = null;
      
      // console.log(trial.clear_canvas)
      if (trial.clear_canvas === false && stim.show_end_time !== null) alert('You can not specify the show_end_time with the clear_canvas property.');

      // calculate the velocity (pix/sec) using the distance and the time.
      // If the pix_sec is specified, the calc_pix_per_sec returns the intact pix_sec.
      // If the pix_frame is specified, the calc_pix_per_sec returns an undefined.
      stim.horiz_pix_sec = calc_pix_per_sec('horiz', stim);
      stim.vert_pix_sec = calc_pix_per_sec('vert', stim);

      // currentX/Y is changed per frame.
      stim.currentX = stim.startX;
      stim.currentY = stim.startY;
    }

    function calc_pix_per_sec (direction, stim){
      let pix_sec , pix_frame, startPos, endPos;
      if (direction === 'horiz'){
        pix_sec = stim.horiz_pix_sec;
        pix_frame = stim.horiz_pix_frame;
        startPos = stim.startX;
        endPos = stim.endX;
      } else {
        pix_sec = stim.vert_pix_sec;
        pix_frame = stim.vert_pix_frame;
        startPos = stim.startY;
        endPos = stim.endY;
      }
      const motion_start_time = stim.motion_start_time;
      const motion_end_time = stim.motion_end_time;
      if ((typeof pix_sec !== 'undefined' || typeof pix_frame !== 'undefined') && endPos !== null && motion_end_time !== null) {
        alert('You can not specify the speed, location, and time at the same time.');
        pix_sec = 0; // stop the motion
      }
      
      if (typeof pix_sec !== 'undefined' || typeof pix_frame !== 'undefined') return pix_sec; // returns an 'undefined' when you specify the pix_frame.

      // The velocity is not specified
          
      if (endPos === null) return 0; // This is not motion.

      if (startPos === endPos) return 0; // This is not motion.
      

      // The distance is specified

      if (motion_end_time === null) { // Only the distance is known
        alert('Please specify the motion_end_time or the velocity when you use the endX/Y property.')
        return 0; // stop the motion
      }

      return (endPos - startPos)/(motion_end_time/1000 - motion_start_time/1000);
    }

    function set_image(stim){
      common_set(stim);
      if (typeof stim.file === 'undefined') {
        alert('You have to specify the file property.');
        return;
      }
      stim.img = new Image();
      stim.img.src = stim.file;
    }

    function set_line(stim){
      common_set(stim);
      if (typeof stim.angle === 'undefined') {
        if ((typeof stim.x1 === 'undefined') || (typeof stim.x2 === 'undefined') || (typeof stim.y1 === 'undefined') || (typeof stim.y2 === 'undefined')){
          alert('You have to specify the angle of lines, or the start (x1, y1) and end (x2, y2) coordinates.');
          return;
        }
        // The start (x1, y1) and end (x2, y2) coordinates are defined.
        // For motion, startX/Y must be calculated.
        stim.startX = (stim.x1 + stim.x2)/2;
        stim.startY = (stim.y1 + stim.y2)/2;
        if (stim.origin_center) {
          stim.startX = stim.startX + centerX;
          stim.startY = stim.startY + centerY;
        }  
        stim.currentX = stim.startX;
        stim.currentY = stim.startY;
        stim.angle = Math.atan((stim.y2 - stim.y1)/(stim.x2 - stim.x1)) * (180 / Math.PI);
        stim.line_length = Math.sqrt((stim.x2 - stim.x1) ** 2 + (stim.y2 - stim.y1) ** 2);
      } else {
        if ((typeof stim.x1 !== 'undefined') || (typeof stim.x2 !== 'undefined') || (typeof stim.y1 !== 'undefined') || (typeof stim.y2 !== 'undefined'))
          alert('You can not specify the angle and positions of the line at the same time.')
        if (typeof stim.line_length === 'undefined') alert('You have to specify the line_length property.');
        
      }
      if (typeof stim.line_color === 'undefined') stim.line_color = '#000000';
    }

    function set_rect(stim){
      common_set(stim);
      if (typeof stim.width === 'undefined') alert('You have to specify the width of the rectangle.');
      if (typeof stim.height === 'undefined') alert('You have to specify the height of the rectangle.');
      if (typeof stim.line_color === 'undefined' && typeof stim.fill_color === 'undefined') alert('You have to specify the either of the line_color or fill_color property.');      
    }

    function set_circle(stim){
      common_set(stim);
      if (typeof stim.radius === 'undefined') alert('You have to specify the radius of circles.');
      if (typeof stim.line_color === 'undefined' && typeof stim.fill_color === 'undefined') alert('You have to specify the either of line_color or fill_color.');      
    }

    function set_text(stim){
      common_set(stim);
      if (typeof stim.content === 'undefined') alert('You have to specify the content of texts.');
      if (typeof stim.text_color === 'undefined') stim.text_color = '#000000';
      if (typeof stim.text_space === 'undefined') stim.text_space = 20;
    }

    function set_cross(stim){
      common_set(stim);
      if (typeof stim.line_length === 'undefined') alert('You have to specify the line_length of the fixation cross.');
      if (typeof stim.line_color === 'undefined') stim.line_color = '#000000';
    }

    function set_manual(stim){
      common_set(stim);
    }
    
    /////////////////////////////////////////////////////////
    // check and set the property for all stimuli
    if (typeof trial.stimuli !== 'undefined') { // The stimuli could be 'undefined' if the stepFunc is specified.
      for (let i = 0; i < trial.stimuli.length; i++){
        const stim = trial.stimuli[i];
        if (typeof stim.obj_type === 'undefined'){
          alert('You have missed to specify the obj_type property in the ' + (i+1) + 'th object.');
          return
        }
        set_functions[stim.obj_type](stim);
      }
    }

    function mouseDownFunc(e){
      
      let click_time;
      
      if (motion_rt_method == 'date') {
        click_time = (new Date()).getTime();
      } else {
        click_time = performance.now();
      }
      
      e.preventDefault();
      
      after_response({
          key: -1,
          rt: click_time - start_time,
          // clickX: e.clientX,
          // clickY: e.clientY,
          clickX: e.offsetX,
          clickY: e.offsetY,
      });
    }

    //console.log(canvas.style.left);

    // When the 'stim' is in motion, update the position after the elapsed time.
    function update_position(stim, elapsed){
      const motion_start = stim.is_frame ? stim.motion_start_frame : stim.motion_start_time;
      const motion_end = stim.is_frame ? stim.motion_end_frame : stim.motion_end_time;

      if (elapsed < motion_start) return;
      if (motion_end !== null && elapsed >= motion_end) return;

      // Note that: You can not specify the speed, location, and time at the same time.

      let LtoR = true; // true = The object moves from left to right

      if (typeof stim.horiz_pix_frame === 'undefined'){ // In this case, horiz_pix_sec is defined.
        if (stim.horiz_pix_sec < 0) LtoR = false;
      } else {
        if (stim.horiz_pix_frame < 0) LtoR = false;
      }

      if (stim.endX === null || (LtoR && stim.currentX <= stim.endX) || (!LtoR && stim.currentX >= stim.endX)) {
        if (typeof stim.horiz_pix_frame === 'undefined'){ // In this case, horiz_pix_sec is defined.
          stim.currentX = stim.startX + Math.round(stim.horiz_pix_sec * (elapsed-motion_start)/1000); // This should be calculated in seconds.
        } else {
          stim.currentX += stim.horiz_pix_frame; 
        }
      }

      let UtoD = true; // true = The object moves from up to down

      if (typeof stim.vert_pix_frame === 'undefined'){ // In this case, vert_pix_sec is defined.
        if (stim.vert_pix_sec < 0) UtoD = false;
      } else {
        if (stim.vert_pix_frame < 0) UtoD = false;
      }

      if (stim.endY === null || (UtoD && stim.currentY <= stim.endY) || (!UtoD && stim.currentY >= stim.endY)) {
        if (typeof stim.vert_pix_frame === 'undefined'){
          stim.currentY = stim.startY + Math.round(stim.vert_pix_sec * (elapsed-motion_start)/1000); // This should be calculated in seconds.
        } else {
          stim.currentY += stim.vert_pix_frame;
        }
      }
    }

    const present_functions = {
      image: present_image,
      line: present_line,
      rect: present_rect,
      circle: present_circle,
      text: present_text,
      cross: present_cross,
      sound: present_sound
    }
    
    function present_image(stim){
      const scale = typeof stim.scale === 'undefined' ? 1:stim.scale;
      const tmpW = stim.img.width * scale;
      const tmpH = stim.img.height * scale;              
      ctx.drawImage(stim.img, 0, 0, stim.img.width, stim.img.height, stim.currentX - tmpW / 2, stim.currentY - tmpH / 2, tmpW, tmpH); 
    }

    function present_line(stim){
      // common
      ctx.beginPath();            
      ctx.lineWidth = stim.line_width;
      ctx.lineJoin = stim.lineJoin;
      ctx.miterLimit = stim.miterLimit;
      //
      const theta = deg2rad(stim.angle);
      const x1 = stim.currentX - stim.line_length/2 * Math.cos(theta);
      const y1 = stim.currentY - stim.line_length/2 * Math.sin(theta);
      const x2 = stim.currentX + stim.line_length/2 * Math.cos(theta);
      const y2 = stim.currentY + stim.line_length/2 * Math.sin(theta);
      ctx.strokeStyle = stim.line_color;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    function present_rect(stim){
      // common
      // ctx.beginPath();            
      ctx.lineWidth = stim.line_width;
      ctx.lineJoin = stim.lineJoin;
      ctx.miterLimit = stim.miterLimit;
      //
      // First, draw a filled rectangle, then an edge.
      if (typeof stim.fill_color !== 'undefined') {
        ctx.fillStyle = stim.fill_color;
        ctx.fillRect(stim.currentX-stim.width/2, stim.currentY-stim.height/2, stim.width, stim.height); 
      } 
      if (typeof stim.line_color !== 'undefined') {
        ctx.strokeStyle = stim.line_color;
        ctx.strokeRect(stim.currentX-stim.width/2, stim.currentY-stim.height/2, stim.width, stim.height);
      }      
    }

    function present_cross(stim){
      // common
      ctx.beginPath();            
      ctx.lineWidth = stim.line_width;
      ctx.lineJoin = stim.lineJoin;
      ctx.miterLimit = stim.miterLimit;
      //
      ctx.strokeStyle = stim.line_color;
      const x1 = stim.currentX;
      const y1 = stim.currentY - stim.line_length/2;
      const x2 = stim.currentX;
      const y2 = stim.currentY + stim.line_length/2;                
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      const x3 = stim.currentX - stim.line_length/2;
      const y3 = stim.currentY;
      const x4 = stim.currentX + stim.line_length/2;
      const y4 = stim.currentY;                
      ctx.moveTo(x3, y3);
      ctx.lineTo(x4, y4);
      // ctx.closePath();
      ctx.stroke();
    }

    function present_circle(stim){
      // common
      ctx.beginPath();            
      ctx.lineWidth = stim.line_width;
      ctx.lineJoin = stim.lineJoin;
      ctx.miterLimit = stim.miterLimit;
      //
      if (typeof stim.fill_color !== 'undefined') {
        ctx.fillStyle = stim.fill_color;
        ctx.arc(stim.currentX, stim.currentY, stim.radius, 0, Math.PI*2, false);
        ctx.fill();
      } 
      if (typeof stim.line_color !== 'undefined') {
        ctx.strokeStyle = stim.line_color;
        ctx.arc(stim.currentX, stim.currentY, stim.radius, 0, Math.PI*2, false);
        ctx.stroke();
      }
    }

    function present_text(stim){
      // common
      // ctx.beginPath();            
      ctx.lineWidth = stim.line_width;
      ctx.lineJoin = stim.lineJoin;
      ctx.miterLimit = stim.miterLimit;
      //
      if (typeof stim.font !== 'undefined') ctx.font = stim.font;

      ctx.fillStyle = stim.text_color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle"

      let column = [''];
      let line = 0;
      for (let i = 0; i < stim.content.length; i++) {
          let char = stim.content.charAt(i);

          if (char == "\n") {    
              line++;
              column[line] = '';
          }
          column[line] += char;
      }

      for (let i = 0; i < column.length; i++) {
          ctx.fillText(column[i], stim.currentX, stim.currentY - stim.text_space * (column.length-1) / 2 + stim.text_space * i);
      }
    }

    function present_sound(){
      // This is not needed actually.
    }

    let startStep = null;
    let sumOfStep;
    let elapsedTime;
    //let currentX, currentY;
    function step(timestamp){
      if (!startStep) {
        startStep = timestamp;
        sumOfStep = 0;
      } else {
        sumOfStep += 1;
      }
      elapsedTime = timestamp - startStep; // unit is ms. This can be used within the stepFunc().

      if (trial.clear_canvas)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (trial.stepFunc !== null) {        
        trial.stepFunc(trial, canvas, ctx, elapsedTime, sumOfStep); // customize
        frameRequestID = window.requestAnimationFrame(step);
        return
      }

      for (let i = 0; i < trial.stimuli.length; i++){
        const stim = trial.stimuli[i];
        const elapsed = stim.is_frame ? sumOfStep : elapsedTime;
        const show_start = stim.is_frame ? stim.show_start_frame : stim.show_start_time;
        const show_end = stim.is_frame ? stim.show_end_frame : stim.show_end_time;

        // if (elapsed >= show_start && (show_end === null || elapsed < show_end)) {
        if (elapsed < show_start) continue;
        if (show_end !== null && elapsed >= show_end) continue;
        if (trial.clear_canvas === false && stim.is_presented) continue;

        update_position(stim, elapsed);

        if (stim.drawFunc !== null) {
          stim.drawFunc(stim, canvas, ctx);
        } else {
          if (stim.change_attr != null) stim.change_attr(stim, elapsedTime, sumOfStep)
          present_functions[stim.obj_type](stim);
        }
        stim.is_presented = true;
      }
      frameRequestID = window.requestAnimationFrame(step);
    }
    
    // Start the step function.
    let frameRequestID = window.requestAnimationFrame(step);

    
    function deg2rad(degrees){
      return degrees / 180 * Math.PI;
    }

    // store response
    let response = {
      rt: null,
      key: null
    };

    // function to end trial when it is time
    // let end_trial = function() { // This causes an initialization error at stim.audio.addEventListener('ended', end_trial); 
    function end_trial(){
      // console.log(default_maxWidth)
      document.getElementById('jspsych-content').style.maxWidth = default_maxWidth; // restore
      window.cancelAnimationFrame(frameRequestID); //Cancels the frame request
      canvas.removeEventListener("mousedown", mouseDownFunc);

      // remove event listeners defined by experimenters.
      if (trial.mouse_down_func !== null){
        canvas.removeEventListener("mousedown", trial.mouse_down_func);
      }
  
      if (trial.mouse_move_func !== null){
        canvas.removeEventListener("mousemove", trial.mouse_move_func);
      }
  
      if (trial.mouse_up_func !== null){
        canvas.removeEventListener("mouseup", trial.mouse_up_func);
      }
  
      if (trial.key_down_func !== null){
        document.removeEventListener("keydown", trial.key_down_func);
      }

      if (trial.key_up_func !== null){
        document.removeEventListener("keyup", trial.key_up_func);
      }

      // stop the audio file if it is playing
      // remove end event listeners if they exist
      if (typeof trial.stimuli !== 'undefined') { // The stimuli could be 'undefined' if the stepFunc is specified.
        for (let i = 0; i < trial.stimuli.length; i++){
          const stim = trial.stimuli[i];
          stim.is_presented = false;
          //console.log(stim);
          if (typeof stim.context !== 'undefined') { // If the stimulus is audio data
            if(stim.context !== null){
              stim.source.stop();
              stim.source.onended = function() { }
            } else {
              stim.audio.pause();
              stim.audio.removeEventListener('ended', end_trial);
            }
          }
        }
      }

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial //音の再生時からの反応時間をとるわけではないから不要？
      // if(context !== null && response.rt !== null){
      //   response.rt = Math.round(response.rt * 1000);
      // }

      // gather the data to store for the trial
      const trial_data = {}
      trial_data['rt'] = response.rt;
      trial_data['response_type'] = trial.response_type;
      trial_data['key_press'] = response.key;
      trial_data['avg_frame_time'] = elapsedTime/sumOfStep;
      trial_data['center_x'] = centerX;
      trial_data['center_y'] = centerY;

      if (trial.response_type === 'mouse'){
        trial_data['click_x'] = response.clickX;
        trial_data['click_y'] = response.clickY;
      } else if (trial.response_type === 'button'){
        trial_data['button_pressed'] = response.button;
      }

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // getAvgSD = function(){

    // }

    // function to handle responses by the subject
    // let after_response = function(info) { // This causes an initialization error at stim.audio.addEventListener('ended', end_trial); 
    function after_response(info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      //display_element.querySelector('#jspsych-html-keyboard-response-stimulus').className += ' responded';

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_type === 'button'){
        // after a valid response, the stimulus will have the CSS class 'responded'
        // which can be used to provide visual feedback that a response was recorded
        // display_element.querySelector('#jspsych-image-button-response-stimulus').className += ' responded';

        // disable all the buttons after a response
        let btns = document.querySelectorAll('.jspsych-image-button-response-button button');
        for(let i=0; i<btns.length; i++){
          //btns[i].removeEventListener('click');
          btns[i].setAttribute('disabled', 'disabled');
        }
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    // if (trial.choices != jsPsych.NO_KEYS) {
    //   let keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
    //     callback_function: after_response,
    //     valid_responses: trial.choices,
    //     rt_method: 'date',
    //     persist: false,
    //     allow_held_key: false
    //   });
    // }

    // hide stimulus if stimulus_duration is set
    // if (trial.stimulus_duration !== null) {
    //   jsPsych.pluginAPI.setTimeout(function() {
    //     //display_element.querySelector('#jspsych-html-keyboard-response-stimulus').style.visibility = 'hidden';
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //   }, trial.stimulus_duration);
    // }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
