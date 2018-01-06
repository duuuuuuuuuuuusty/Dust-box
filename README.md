# Dust-box
  * Requires JQuery 1.7.2+
  * Supports CSS styling, including (user-specific) name, message, dates, images
  * Replicates C-Box appearance by default
  * Does not use iframes
  * Implements channel-based filtering
  * Uses font-awesome for refresh icon and volume icons, because why *not* load an entire font library for four icons, am I right? If you feel so inclined, the references to Font Awesome are on lines (of the HTML file): 288, 318, 325, 326, 329, 330, 333, 334, 375, 377

## Installation
  * Copy and paste to webpage maker - use include keys.
  * Make sure to install Font Awesome, or replace their references
  * Fill *src* attribute of *audio#notify* element
  * Configure settings
  * Warning: Script contains HTML entities that may parse and break functionality if the webpage that the script is hosted on is edited

**If you're using the setting to enable usage of the default forum avatar:**
Create an element on the page containing the JC Ink < !-- |avatar| --> variable. You may set this to display:none;
Point the script variable *default_avatar_location* to this element using standard selector string notation (ie: '.defaultavatar img')

## Settings list
  * use_custom_structure = Must be enabled to utilize (most of) the following settings
  * timestamp_is_enabled = Enable or disable message timestamping. Default option: relative time (ie: "7 minutes ago")
  * use_absolute_time = If enabled, use absolute time (ie: "7:59PM 8/11/2017")
  * use_custom_nickname = If enabled, use a user-filled nickname for the message. Will user forum name if field is un-filled
  *	use_forum_presuffix = If enabled, pull the username from the shoutbox history with full prefix/suffix HTML
  * enable_avatar_image = Defaults to logged-in user's avatar
  * use_custom_avatar = If enabled, use a user-filled avatar for the message
  * enable_channels = True/false. Append channels to #sbr1-0
  * use_html = Enable parsing of HTML in messages - utilizes html_whitelist - defaults to JC Ink's BB code
  * html_whitelist = Whitelisted HTML element types, in array format *['b', 'i', 'a', 'img', 'div', 'span']*,
  * default_avatar_location = Selector string for default avatar. Only required if enable_avatar_image is true, and use_custom_avatar is false. selector eg: '*.avatar-box img*'
  * cs = Custom structure markup. Requires *.sbr_url, .sbr_time, .sbr_nn, .sbr_body* elements
  * sb_timer = Refresh time, in milliseconds.
  * sb_decay_factor = How much time to add to *sb_timer* after every *empty_refresh*, in milliseconds. Set to 0 to disable
  * sb_reset_decay = Number of *empty_refresh* required to reset *sb_timer* to default. Prevents infinite polling time
  * refresh_count = Incrementing variable, do not adjust
  * empty_refresh = Incrementing variable, do not adjust
