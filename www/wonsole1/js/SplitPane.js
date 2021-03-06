/*http://luke.breuer.com/tutorial/javascript-drag-and-drop-tutorial.aspx*/
var splitPaneStore = new Persist.Store("splitPanePosition"); //A persistent data store used to preserve split pane position across page changes/refreshes

var _startX = 0; // mouse starting positions 
var _startY = 0; 
var _offsetX = 0; // current element offset 
var _offsetY = 0; 
var _dragElement; // needs to be passed from OnMouseDown to OnMouseMove 
var _oldZIndex = 0; // we temporarily increase the z-index during drag 

var winW = 1;
var splitPanePercentage = 50;

function InitDragDrop() { 
    document.onmousedown = OnMouseDown; 
    document.onmouseup = OnMouseUp; 
    
    if (document.body && document.body.offsetWidth) {
        winW = document.body.offsetWidth;
    }
    if (document.compatMode=='CSS1Compat' &&
            document.documentElement &&
            document.documentElement.offsetWidth ) {
        winW = document.documentElement.offsetWidth;
    }
    if (window.innerWidth && window.innerHeight) {
        winW = window.innerWidth;
    }
    
    splitPaneStore.get("splitPanePosition", function(ok, val) {
        if (ok && val!=null)
            splitPanePercentage = val;
    });
    
    document.getElementById("splitterLeft").style.width = splitPanePercentage+"%";
    document.getElementById("splitterRight").style.width = 99-splitPanePercentage+"%";/*The last percent is for the divider bar thing.*/
}

//Save persistent data when leaving the page.
function beforeSplitPaneUnload() {
    splitPaneStore.set("splitPanePosition", splitPanePercentage);
}

function OnMouseDown(e)
{
    // IE is retarded and doesn't pass the event object
    if (e == null) 
        e = window.event; 
    
    // IE uses srcElement, others use target
    var target = e.target != null ? e.target : e.srcElement;

    // for IE, left click == 1
    // for Firefox, left click == 0
    if ((e.button == 1 && window.event != null || 
        e.button == 0) && 
        target.className == 'drag')
    {
        // grab the mouse position
        _startX = e.clientX;
        _startY = e.clientY;
        
        // grab the clicked element's position
        _offsetX = ExtractNumber(target.style.left);
        _offsetY = ExtractNumber(target.style.top);
        
        // bring the clicked element to the front while it is being dragged
        _oldZIndex = target.style.zIndex;
        target.style.zIndex = 10000;
        
        // we need to access the element in OnMouseMove
        _dragElement = target;

        // tell our code to start moving the element with the mouse
        document.onmousemove = OnMouseMove;
        
        // cancel out any text selections
        document.body.focus();

        // prevent text selection in IE
        document.onselectstart = function () { return false; };
        // prevent IE from trying to drag an image
        target.ondragstart = function() { return false; };
        
        // prevent text selection (except IE)
        return false;
    }
}


function OnMouseMove(e)
{
    if (e == null) 
        var e = window.event; 

    splitPanePercentage = 100*(e.clientX)/winW;
    if(splitPanePercentage< 0 ) splitPanePercentage= 0;
    if(splitPanePercentage> 99) splitPanePercentage= 99;
    // Resize the left and right divs.
    document.getElementById("splitterLeft").style.width = splitPanePercentage+"%";
    document.getElementById("splitterRight").style.width = 99-splitPanePercentage+"%";/*The last percent is for the divider bar thing.*/
}

function OnMouseUp(e)
{
    if (_dragElement != null)
    {
        _dragElement.style.zIndex = _oldZIndex;

        // we're done with these events until the next OnMouseDown
        document.onmousemove = null;
        document.onselectstart = null;
        _dragElement.ondragstart = null;

        // this is how we know we're not dragging      
        _dragElement = null;
    }
}

function ExtractNumber(value)
{
    var n = parseInt(value);
	
    return n == null || isNaN(n) ? 0 : n;
}