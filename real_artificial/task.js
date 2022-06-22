// ============================================================================
// --- SPECIFY RUNTIME PARAMS
// ============================================================================

// --- specify task name and version
const experiment_name_verbose = "This is a template for JSPSYCH";
const experiment_name = "template";
const TASK_VERSION = "0.1a";
const api_url = "https://z8ktdbtwhe.execute-api.us-east-1.amazonaws.com/api/save";

// --- set debug flag
const DEBUG = false;

// ============================================================================
// --- SPECIFY TASK PARAMETERS
// ============================================================================

// specify trial tables
// load from automate/trial_table.json after running through R script
const trial_table = [
    { left_img: "fake", right_img: "real" },
    { left_img: "real", right_img: "fake" },
    { left_img: "real", right_img: "real" },
    { left_img: "fake", right_img: "fake" },
    { left_img: "1", right_img: "2" },
];

// --- Durations

// time in ms for the fixation cross preceding each stimuli
const fixation_duration = 1000;

// time in ms before trial times out
const timeout_duration = 10000;

// --- init any counters
var event_type; // for logging event type that causes data to be saved

// ============================================================================
// --- DETERMINE USER PLATFORM
// ============================================================================

// t/f - whether participant is on a mobile platform or not
const onMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
document.body.className += onMobile ? "mobile" : "desktop";

// ============================================================================
// --- INITIALIZE JSPSYCH
// ============================================================================

const jsPsych = initJsPsych({
    // setting the display element (default: body)
    display_element: "container",
    // send data to server if browser interaction changes (e.g. participant leaves tab)
    on_interaction_data_update: () => {
        console.log("callback: on_interaction_data_update()");
        event_type = "on_interaction_data_update()";

        const curr_data = jsPsych.data.get();
        console.log(curr_data);
        //upload_data(api_url, curr_data, DEBUG);
    },
    on_close: () => {
        console.log("callback: on_close()");
        event_type = "on_close()";

        const curr_data = jsPsych.data.get();
        console.log(curr_data);
        //upload_data(api_url, curr_data, DEBUG);
    },
    on_timeline_start: function() {
        console.log("callback: on_timeline_start()");
        event_type = "on_timeline_start()";

        console.log(`Running on: ${onMobile ? "mobile" : "desktop"}.`);
        const curr_data = jsPsych.data.get();
        console.log(curr_data);
    },
    on_timeline_finish: function() {
        console.log("callback: on_timeline_finish()");
        event_type = "on_timeline_finish()";

        // --- save data to server
        const curr_data = jsPsych.data.get();
        console.log(curr_data);
        //upload_data(api_url, final_data, DEBUG);
    },
});

// ============================================================================
// --- EXTRACT IDs from URL
// ============================================================================

// --- extract participant ID and other params from URL
var participant_id = jsPsych.data.getURLVariable("PARTICIPANT_ID") || "NA";
var study_id = jsPsych.data.getURLVariable("STUDY_ID") || "NA";
var session_id = jsPsych.data.getURLVariable("SESSION_ID") || "NA";
var session_uuid = create_uuid() || "NA";

// -- get task_length_params
var num_blocks = jsPsych.data.getURLVariable("N_BLOCKS") || 1;

// --- get session start
var timestamp_start = new Date();
timestamp_start = timestamp_start.toISOString();

// --- get the current date
var now = new Date();
var currentDateString = now.toISOString();

// --- echo to log
console.log("Participant ID: " + participant_id);
console.log("Study ID: " + study_id);
console.log("Session ID: " + session_id);
console.log("Session UUID: " + session_uuid);

// console.log(trial_table);
let date_now = new Date();

// ============================================================================
// --- SAVE DATA PROPERTIES TO JSPSYCH DATA COLLECTION
// ============================================================================

// --- save to JsPsych data file
jsPsych.data.addProperties({
    experiment_version: TASK_VERSION,
    trial_timestamp: null,
    task_section: null,
    completion: null,
    experiment_name: experiment_name,
    subject_id: participant_id,
    study_id: study_id,
    session_id: session_id,
    session_uuid: session_uuid,
    experiment_platform: onMobile ? "mobile" : "desktop",
    timestamp_start: timestamp_start,
    session_date: `${("0" + (date_now.getMonth() + 1).toString()).slice(-2)}-` +
        `${("0" + date_now.getDate().toString()).slice(-2)}-` +
        `${date_now.getFullYear().toString()}`,

    // --- echo durations, timeouts
    expected_trial_count: trial_table.length,
    fixation_duration: fixation_duration,
    timeout_duration: timeout_duration,
    trial_num: null,

    // --- collect window /screen information
    useragent: navigator.userAgent,
    on_mobile: onMobile,
    window_innerHeight: window.innerHeight,
    window_innerWidth: window.innerWidth,
    screen_availHeight: screen.availHeight,
    screen_availWidth: screen.availWidth,
    screen_width: screen.width,
    screen_height: screen.height,
});

// ============================================================================
// --- SPECIFY INSTRUCTIONS, MESSAGES
// ============================================================================

const instructions = {
    type: jsPsychInstructions,
    css_classes: [],
    pages: [
        "In this activity, you will be presented with images, some real, some artificially created.",
        "Your goal is to select the real image amongst the artificial image.",
        "You will have up to 10 seconds to make a judgement.",
        "Press 'Next' to start the activity.",
    ].map((it) => "<div class='instructions'>" + it + "</div>"),
    show_clickable_nav: true,
    button_label_previous: "Previous",
    button_label_next: "Next",
    on_finish: (data) => {
        data.task_section = "instructions";
    },
};

const msg_exp_complete = {
    type: jsPsychInstructions,
    css_classes: ["instructions"],
    pages: ["Thank you for your time! To learn more about our lab's work, visit <a href='https://sciences.ucf.edu/psychology/contextlab/' target='_blank'>https://sciences.ucf.edu/psychology/contextlab/</a>"],
    show_clickable_nav: true,
    button_label_next: "Close Task",
    on_finish: (data) => {
        data.task_section = "debriefing";
    },
};

// ============================================================================
// --- SPECIFY TASK PROCEDURE
// ============================================================================

var fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: "NO_KEYS",
    trial_duration: fixation_duration,
};

var grid_buttons = {
    type: jsPsychHtmlButtonResponse,
    trial_duration: timeout_duration,
    stimulus: 'Which image is real?',
    prompt: '', //'Please select the `real` satellite image.',
    choices: [jsPsych.timelineVariable('left_img'), jsPsych.timelineVariable('right_img')],
    button_html: function() {
        var html = '<button><img id="button_img" src="img/%choice%.png"></button>';
        return html;
    },
    on_finish: (data) => {
        data.trial_timestamp = new Date().toISOString();
        data.trial_type = "select-amongst-real-artificial-image";
        data.task_section = "test";
        trial_counter++;
        data.trial_num = trial_counter;
    },
}

// specify trial procedure
var trial_procedure = {
    timeline: [fixation, grid_buttons],
    timeline_variables: trial_table,
    randomize_order: true,
    repetitions: num_blocks
}

// ============================================================================
// --- SPECIFY SEQUENCE AND RUN TIMELINE
// ============================================================================

// init trial counter
var trial_counter = 0;
var trial_table_length = trial_table.length;

// to manually preload media files, create an array of file paths
// TODO: generate with R script
var images = ['img/real.png', 'img/fake.png'];

// these array can be passed into the preload plugin using the images, audio 
// and video parameters
var preload = {
    type: jsPsychPreload,
    images: images
}

// prepare timeline
// TODO: add `test_procedure` below when ready
var tl = [preload, instructions, trial_procedure, msg_exp_complete];

// jspsych event timeline
jsPsych.run(tl);