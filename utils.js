// SOURCE: https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php ---
// crypto.randomUUID() doesn't work in all browsers
function create_uuid() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

// upload data ---
function upload_data(api_url, data, DEBUG) {
  var api_url = api_url;

  // -------------------

  let xhr = new XMLHttpRequest();

  // -------------------

  // Create a state change callback that returns response from server
  xhr.onreadystatechange = function () {
    var response_ = new Object();
    response_.responseText = this.responseText;
    response_.readyState = xhr.readyState;
    response_.status = xhr.status;
    console.log(response_);
  };

  // -------------------

  if (!DEBUG) {
    var jd = new Object();

    // --- collect identifiers
    jd.participant_id = participant_id;
    jd.session_id = session_id;
    jd.session_uuid = session_uuid;
    jd.experiment_name = experiment_name;
    jd.timestamp_start = timestamp_start;
    jd.task_version = TASK_VERSION;
    jd.useragent = navigator.userAgent;
    jd.debug_flag = DEBUG;
    jd.event_type = event_type;

    // --- collect runtime info
    jd.window_location_href = window.location.href;
    jd.window_location_hostname = window.location.hostname;
    jd.window_location_protocol = window.location.protocol;

    // --- collect window /screen information
    jd.screen_width = screen.width;
    jd.screen_height = screen.height;

    // ---collect trial data
    jd.trials = data.trials;

    var data = JSON.stringify(jd);
    xhr.withCredentials = false;
    xhr.open("POST", api_url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    //xhr.setRequestHeader("X-API", "TEST");
    xhr.send(data);
    console.log(data);
  } else {
    console.log("Data not sent - in DEBUGGING MODE");
    console.log(data);
  }
}