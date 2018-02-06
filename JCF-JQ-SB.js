  // Settings
  var use_custom_structure = true, // Must be enabled to utilize the following settings
    timestamp_is_enabled = true, // False = turn off timestamping
    use_absolute_time = true, // False = use relative
    use_custom_nickname = false, // False = logged-in member name
    use_forum_presuffix = true, // Use the forum's member group prefixes and suffixes
    enable_avatar_image = true, // Defaults to logged-in member avatar
    use_custom_avatar = true, // Use field-set image
    enable_channels = true, // Enable chat channels
    use_html = true,
    html_whitelist = ['b', 'i', 'a', 'img', 'div', 'span'],
    default_avatar_location = '.cavatar img',
    cs = $('<div class="sbrow"><span class="sbmsg_wrap"><img class="sbr_url"><span class="sbr_time"></span><span class="sbr_nn"><a></a></span><span class="sbr_b_wrap"><p class="sbr_body"></p></span></span></div>'),
    sb_timer = 5000,
    sb_decay_factor = 400,
    sb_reset_decay = 40,
    refresh_count = 0,
    empty_refresh = 0;
  $(function _initload() {
    _mkcon().success(function(data) {
      if (use_custom_structure == true) {
        _cparse(data, function(str) {
          $('#shoutbox').html(str)
        })
      } else {
        var temp = $('<textarea></textarea>')
        $(temp).html(data)
        $('#shoutbox').html($(temp).find('div#iframe-shouts'));
      }
    })
    if (use_custom_nickname == false) {
      $('#sb_nn').remove();
    }
    if (use_custom_avatar == false) {
      $('#sburl').remove();
    }
    if (enable_channels == false) {
      $('#sbr1-0').remove();
    } else {
      $('.sbrow:not(.sbrow[channel='+$('.sbtabactive').attr('tab')+'])').addClass('sb_c_hidden')    
    }
  })

  function _mkcon() {
    return $.ajax({
      url: "/sb_iframe.php?step=D2",
      type: 'GET'
    })
  };

  function _cparse(data, callback) {
    var frame = $('<div id="iframe-shouts"></div>'),
      temp = $('<textarea></textarea>').html(data);
    $('#historycontainer').empty()
    $(temp).find('div b + span').each(function() {
      try {
        var msg_arr = JSON.parse($(this).html())
      } catch (e) {
        console.log($(this).html(), '\nThis message has caused an error and cannot be parsed - check for double quotation marks\n')
        var str = $(this).html(),
          s = str.indexOf('","msg":"') + 9,
          d = str.lastIndexOf('","id":"'),
          r = str.substring(s, d).replace(/"/g, '\\"'),
          nu = str.substring(0, s) + r + str.substring(d, str.length),
          msg_arr = JSON.parse(nu);
      }
      var a = cs.clone();
      $('#historycontainer').text($('#historycontainer').text() + $(this).text())
      a.addClass('user-' + msg_arr['id'])
      a.find('.sbr_nn a').text(msg_arr['nn']).attr('href', '/index.php?showuser=' + msg_arr['id'])
      if (use_html == true) {
        var str = msg_arr['msg'].replace(/\&\amp;amp;gt;/g, '>')
        for (var i = 0; i < html_whitelist.length; i++) {
          var r1 = "\&\amp;amp;lt;" + html_whitelist[i],
            r2 = "\&\amp;amp;lt;/" + html_whitelist[i],
            reg1 = new RegExp(r1, "g"),
            reg2 = new RegExp(r2, "g"),
            m1 = "<" + html_whitelist[i],
            m2 = "<\/" + html_whitelist[i],
            nu = str.replace(reg1, m1).replace(reg2, m2),
            str = nu;
        }
        a.find('.sbr_body').append(str)
      } else {
        a.find('.sbr_body').append(msg_arr['msg'])
      }
      a.find('.sbr_url').attr('src', msg_arr['avurl'])
      if (timestamp_is_enabled == true && use_absolute_time == true) {
        a.find('.sbr_time').text(msg_arr['time'])
      } else if (timestamp_is_enabled == true && use_absolute_time == false) {
        a.find('.sbr_time').text(
          $(this).parent().contents().filter(function() {
            return this.nodeType == 3;
          })[0].nodeValue);
      }
	  if (enable_channels == true) {
	    a.attr('channel', msg_arr['channel'])
		if (a.attr('channel') != $('.sbtabactive').attr('tab')) {
		  a.addClass('sb_c_hidden')
		}
	  }
	  if (use_custom_nickname == false && use_forum_presuffix == true) {
	    a.find('.sbr_nn').html($(this).prev('b').html())
	  }
      frame.append(a)
    })
    callback(frame)
  }
  $(document).on('click', '#msgsend', function() {
    if (use_custom_structure == true) {
      var arr = {
          avurl: '',
          nn: '<!-- |name| -->',
          msg: $('#msginput').val(),
          id: '<!-- |id| -->',
          time: '',
		  channel: ''
        }, // Escape double quotations
        m_str = $('<div />').text($('#msginput').val()).html(),
        dance = m_str.replace(/"/g, '\"');
      if (use_html == true) {
        arr['msg'] = $('<div />').text(dance).html()
      } else {
        arr['msg'] = dance;
      }
      if (enable_avatar_image == true && use_custom_avatar == false) {
        arr['avurl'] = $(default_avatar_location).attr('src');
      } else if (enable_avatar_image == true && use_custom_avatar == true) {
        arr['avurl'] = $('#sburl').val();
      }
      if (use_custom_nickname == true && $('#sbnn').val()) {
        arr['nn'] = $('#sbnn').val()
      }
      if (timestamp_is_enabled == true && use_absolute_time == true) {
        var objDate = new Date(),
          locale = "en-gb",
          timestamp = objDate.toLocaleString(locale, {
            day: "numeric",
            month: "short",
            year: "2-digit",
          }) + ', ' + objDate.toLocaleString(locale, {
            hour12: true,
            hour: "numeric",
            minute: "numeric"
          });
        arr['time'] = timestamp;
      }
	  if (enable_channels == true) {
	    arr['channel'] = $('.sbtabactive').attr('tab')
	  }
      var msg = JSON.stringify(arr);
    } else {
      var msg = $('#msginput').val()
    }
    if ($('#msginput').val()) {
      $.post("/index.php?act=Shoutbox&viewing=d2iframe&submit=Shout", {
        Post: msg
      }).done(function() {
        _refresh(msg);
        $('#msginput').val('')
      });
    } else {
      alert('Please enter a message')
    }
  })

  function _refresh(msg) {
    $('#sbref').children().addClass('fa-spin-4x')
    _mkcon().success(function(data) {
      var temp = $("<textarea></textarea>");
      $(temp).html(data)
      var n = $(temp).find('div b + span').text(),
        o = $('#historycontainer').text();
      if (n != o) {
        empty_refresh = 0;
        if (use_custom_structure == true) {
          _cparse(data, function(str) {
            $('#shoutbox').html(str)
          })
        } else {
          $('#shoutbox').html($(temp).find('div#iframe-shouts'));
        }
        if (n != msg + o && refresh_count > 1) {
          $('#notify')[0].play();
        }
        $('#sb_no_new').hide()
      } else {
        empty_refresh++;
        if (msg === 'mref') {
          var time = new Date().toLocaleString('en-gb', {
            hour12: true,
            hour: "numeric",
            minute: "numeric"
          });
          $('#sb_no_new').fadeIn(200).children().text(time)
        }
      }
      $('#sbref').children().removeClass('fa-spin-4x')
      console.log(empty_refresh, refresh_count)
    })
  }
  $(document).on('click', '#sbref', function() {
    _refresh('mref');
  })
  $(document).on('click', '#sb_vol_control .fa-volume-up', function() {
    $(this).removeClass('fa-volume-up').addClass('fa-volume-down');
    $('#notify')[0].volume = 0.4;
  })
  $(document).on('click', '#sb_vol_control .fa-volume-down', function() {
    $(this).removeClass('fa-volume-down').addClass('fa-volume-off');
    $('#notify')[0].volume = 0.0;
  })
  $(document).on('click', '#sb_vol_control .fa-volume-off', function() {
    $(this).removeClass('fa-volume-off').addClass('fa-volume-up');
    $('#notify')[0].volume = 1.0;
  })
  $(document).on('click', '.sbtab', function() {
    var testit = $(this).attr('tab')
    $('.sbrow[channel='+testit+']').removeClass('sb_c_hidden')
    $('.sbrow:not(.sbrow[channel='+testit+'])').addClass('sb_c_hidden')
	$('.sbtabactive').removeClass('sbtabactive')
	$(this).addClass('sbtabactive')
  })
 
  function _superfresh() {
    _refresh();
    refresh_count++;
    if (empty_refresh > sb_reset_decay) {
      empty_refresh = 0;
    }
    window.setTimeout(_superfresh, sb_timer + (empty_refresh * sb_decay_factor));
  }
  _superfresh();
