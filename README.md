# Wheel of misfortune

Need a quick, visual way to show a collection of images, have them spin, and
pick an image at random? If so, this is the piece of code for you.

## Demo

https://bubblegum-canvas.cloudvent.net

This was from the final presentation session of an [Institute of
Code](https://www.instituteofcode.com) course. Each student had to present their
final work, so to add a little bit of drama to select who was going to go next I
threw this together.

## To try it out

### With Jekyll

If you have Jekyll installed then you can serve it directly. The example shows
how the HTML can use Jekyll frontmatter to construct the list of images.

```shell
jekyll serve
```

and visit http://localhost:4000

Click the "Spin the wheel" button a few times.

### Without Jekyll

Load `index-nojekyll.html` in to your browser.

Click the "Spin the wheel" button a few times.

## To use it

Prepare the images to use. Square images work well, up to 800x800 pixels in
size. See the `img` directory in this repository for an example.

Then, load `wom.js` in your HTML page.

Create a collection of `<img>` elements somewhere on the HTML page. These need to
be present, but hidden. The example uses a `div#tiles` to contain all the
images, and sets `display: none` in the CSS to hide it.

Create the HTML for the wheel and the button that will start it.

I recommend using

```html
<div>
  <div>
    <canvas id="wheel"></canvas>
  </div>
  <div>
    <button id="spin-wheel">Spin the wheel</button>
  </div>
</div>
```

This gives you:

1. An outermost containing `div` that you can use to style the wheel and button.
2. A containing `div` for the canvas element that will contain the wheel, so
   it's easy to style just that.
3. A containing div for the `button` (note: by default the button will be set to
   the same width as the canvas that contains the wheel.) This must be a
   `button` element, since it will be enabled/disabled during the lifetime of
   the wheel.

Add the Javascript to initialise the wheel. You can use:

```javascript
<script>
  window.addEventListener("load", function() {
    new Wheel("#wheel", "#tiles img", "#spin-wheel");
  });
</script>
```

The three parameters to the object constructor are:

1. Selector for the canvas element to use for the wheel.
2. Selector for the `img` elements that contain the images to use.
3. Selector for the button.