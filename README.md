!['images'](https://source.unsplash.com/1600x900/?coding,JavaScript)
# IMPORTANT: Bug Fixes

## `navigator.getUserMedia`

```javaSceipt
navigator.getUserMedia````  
is now deprecated and is replaced by 
```javaScript 
navigator.mediaDevices.getUserMedia
```
. To fix this bug replace all versions of `navigator.getUserMedia` with `navigator.mediaDevices.getUserMedia`

## Low-end Devices Bug

The video eventListener for `play` fires up too early on low-end machines, before the video is fully loaded, which causes errors to pop up from the Face API and terminates the script (tested on Debian [Firefox] and Windows [Chrome, Firefox]). Replaced by `playing` event, which fires up when the media has enough data to start playing.
