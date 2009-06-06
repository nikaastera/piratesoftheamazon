/*

This is another modified version of the Firefox extension Pirates of the Amazon, originally written by Enrique B. and John S.
- The original images have been restored. Thanks to legaliamnot for keeping the original pictures and giving them to me.
- The code that used to change your user agent is again commented out (for your privacy).
hac.

 */

// ==UserScript==
// @name           Pirates of the Amazon
// @namespace      bla
// @include        *
// ==/UserScript==


try{
// Function that inserts the download image
function ReplaceImage(newhtml){
	// get the html of the title 
	// add the image after the title
	finalhtml = titlefield + newhtml;
	document.getElementById('btAsinTitle').innerHTML= finalhtml;	
	}
}
catch(e)
{
//alert(e);
}

try{
// Which site are we searching again ?
var URLname= "thepiratebay.org";
var not_downloadable_image = "chrome://piratesoftheamazon/content/pics/not_downloadable.gif";
var not_available_image = "chrome://piratesoftheamazon/content/pics/not_available.gif";
var download_now_image = "chrome://piratesoftheamazon/content/pics/download.gif";
var loading_gif = "chrome://piratesoftheamazon/content/pics/loading.gif";

// Find the title on the page
// And get rid off brackets and parenthese
var titlefield = document.getElementById('btAsinTitle').innerHTML;
if (titlefield == null){}
else
{
titlefield = document.getElementById('btAsinTitle').innerHTML;
temp = '<br><br><img style="border:0px; width:433; height:90;" src="' + loading_gif + '"><br>';
// add the image after the title
finalhtml = titlefield + temp;
document.getElementById('btAsinTitle').innerHTML= finalhtml;

var splitarray = new Array();
splitarray = titlefield.split('(');
var without_parenthese = splitarray[0];
var splitarray2 = new Array();
splitarray2 = without_parenthese.split('[');
var myTextField = splitarray2[0];
// Find The category of the product
var myCategory = document.getElementById('navCategoryInner').innerHTML;
var found4 = myCategory.match(/\>([^\<]*)\</);
cat = found4[1];
category = 0;
var MusicList = new Array ("Music", "Musique", "Musik");
var MovieList = new Array ("Movies &amp; TV", "Movies & TV", "DVD");
var SoftwareList = new Array ("Software", "Logiciels");
var GameList = new Array ("Video Games", "PC &amp; Video Games", "Games", "Computer &amp; Video Games", "Jeux vidéo et Consoles");
var BookList = new Array ("Books", "Livres", "Bücher");

//Match the categories of the 2 pages

for ( i=0; i < MusicList.length; i++ )
{
	check = MusicList[i];
	if (cat == check)
	{
		torrent_cat = 'audio';
		category = 1;
	}
}
for ( i=0; i < MovieList.length; i++ )
{
	check = MovieList[i];
 	if (cat == check)
	{
		torrent_cat = 'video';
		category = 1;
	}
}
for ( i=0; i < SoftwareList.length; i++ )
{
	check =SoftwareList[i];
 	if (cat == check)
	{
		torrent_cat = 'apps';
		category = 1;
	}
}
for ( i=0; i < GameList.length; i++ )
{
	check = GameList[i];
 	if (cat == check)
	{
		torrent_cat = 'games';
		category = 1;
	}
}
for ( i=0; i < BookList.length; i++ )
{
	check = BookList[i];
 	if (cat == check)
	{
		torrent_cat = 'others';
		category = 1;
	}
}


// Insert an 'not downloadable' image if the category 
// does not match with a digital product
if (category == 0)
{ 
	newhtml = '<br><br><img style="border:0px; width:433; height:90;" src="' + not_downloadable_image + '"><br>'; 
	ReplaceImage(newhtml);
}

// If the category matches a product available in 0's and 1's
// look for the actual link 
if (category == 1)
{
	myTextField2 = myTextField.replace(/\W+/g, "_");
	// Create a URL that searches the torrent site, ordered by amount of seeds  
	var newlink = 'http://'+ URLname +'/s/?q=\"' + myTextField2 + "\"&" + torrent_cat + "=on&searchTitle=on&page=0&orderby=7";
	// Go fetch the source code of the torrent search page
	GM_xmlhttpRequest(
	{
		method:"GET",
		url: newlink,
		headers:
		{
	        // Nobody changes my user agent.
	        //"User-Agent":"Pirates-of-the-Amazon",
	        //"Operating Ship": "HMS Bounty",
	    	//"User-Agent":"Mozilla/5.0",  
			"Accept":"text/xml"
		},

		// Function performed when the search result page is found
		onload:function(responseDetails){
			// what is the source code of that page
			source2 = responseDetails.responseText;
			// Find the first torrent link
			pat1 =/href\=\"\/torrent\/(\d+)\//;
			found3 = source2.match(pat1);

			// if there was NO search result
			// insert an 'not available' image
			if (found3 == null){
				newhtml = '<br><br><img style="border:0px; height:90;" src="' + not_available_image + '"><br>'; 
				ReplaceImage(newhtml);
			}
			// if there WAS a search result [^\"]
			// insert an 'download now' image + myTextField +'\"'
			else{
				finallink = 'http://torrents.'+ URLname +'/' + found3[1] +"/" + found3[1] + ".TPB.torrent";
				newhtml = '<br><br><a href="'+ finallink + '"><img style="border:0px; width:433; height:90;"src="' + download_now_image + '"></a><br>'; 
				ReplaceImage(newhtml);
			}
		}
		
	});
}

}

// end try
}
catch(e)
{
}

