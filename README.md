# Dust-box
  * Requires JQuery 1.7.2+
  * Supports multitude of settings

## Installation
  * Copy and paste to webpage maker - use include keys.
  * Ensure that the src attribute of audio#notify is filled
  * Configure settings

**If you're using the setting to enable usage of the default forum avatar:**
Create an element on the page containing the JC Ink <!-- |avatar| --> variable. You may set this to display:none;
Point the script variable *default_avatar_location* to this element using standard selector string notation (ie: '.defaultavatar img')

## Settings list
  * use_custom_structure =  Must be enabled to utilize the following settings, and must not defy custom settings
  * timestamp_is_enabled =  Enable or disable message timestamping. Default option: relative time (ie: "7 minutes ago")
  * use_absolute_time = If enabled, use absolute time (ie: "7:59PM 8/11/2017")
  * use_custom_nickname = If enabled, use a user-filled nickname for the message. Default: Use forum account name
  * use_custom_avatar = If enabled, use a user-filled avatar for the message. Default: No avatar
  * use_avatar = If enabled, use the forum account's avatar for the message. REQUIRES: *default_avatar_location*
  * default_avatar_location = Selector string for default avatar. Only required if use_avatar is true. eg: '*.avatar-box img*'
  * cs = Custom structure markup. Requires *.sbr_url, .sbr_time, .sbr_nn, .sbr_body* elements
  * sb_timer = Refresh time, in milliseconds.
  * sb_decay_factor = How much time to add to *sb_timer* after every *empty_refresh*, in milliseconds. Set to 0 to disable
  * sb_reset_decay = Number of *empty_refresh* required to reset *sb_timer* to default. Prevents infinite polling time
  * refresh_count = Incrementing variable, do not adjust
  * empty_refresh = Incrementing variable, do not adjust
