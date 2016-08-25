$(function() {

    var loading = true;
    var loadingSource = $("#loadingTemplate").html();
    var loadingTemplate = Handlebars.compile(loadingSource);
    var loadingHtml = loadingTemplate({
        loading: loading
    });
    $("#loader").append(loadingHtml);

    // this is for handlebars template
    var source = $("#feedTemplate").html();
    var template = Handlebars.compile(source);

    // config file will house all of the api's and feeds
    var Config = {
        reddit: {
            'campingHiking': 'https://accesscontrolalloworiginall.herokuapp.com/https://www.reddit.com/r/CampingandHiking.json'
        },
        outside: {
            'outsideGear': 'https://accesscontrolalloworiginall.herokuapp.com/http://www.outsideonline.com/rss/gear/rss.xml',
            'outsideAdventure': 'https://accesscontrolalloworiginall.herokuapp.com/http://www.outsideonline.com/rss/adventure/rss.xml',
            'outsideCulture': 'https://accesscontrolalloworiginall.herokuapp.com/http://www.outsideonline.com/rss/culture/rss.xml',
            'outsideTravel': 'https://accesscontrolalloworiginall.herokuapp.com/http://www.outsideonline.com/rss/travel/rss.xml'
        }
    };
    // below are all of the ajax calls that will go and get the feeds
    $.ajax({
        // This is the syntax to get the json feed
        type: 'GET',
        url: Config.reddit['campingHiking'],
        dataType: 'json',
        error: function() {
            alert('Unable to load feeds');
        },
        success: function(json) {

            // Hide spinner at this point, because we know we have at least SOME data.
            $('#loader').hide();

            // this is going into the object and looping through all of the posts
            json.data.children.forEach(function(current) {

                // This is the object that pulls out the relevent information from the loop
                var data = {
                        Reddit: true,
                        Title: current.data.title,
                        Author: current.data.author,
                        Link: current.data.permalink,
                        Description: current.data.selftext,
                        Id: current.data.id,
                        Picture: (function() {
                            if (current.data.thumbnail === "self") {
                                return false;
                            } else {
                                return current.data.url;
                            }
                        }())
                    }
                    // console.log(x.Picture);
                    // This is for handlebars to append the object into the UI
                var html = template(data);
                $("#redditFeedItems").append(html);
                $("#aggregateFeedItems").append(html);
                $('.modal-trigger').leanModal();
            })
        }
    })

    $.ajax({
        type: 'GET',
        url: Config.outside['outsideGear'],
        dataType: 'xml',
        error: function() {
            alert('Unable to load feeds');
        },
        success: function(xml) {

            $(xml).find('channel').each(function(){
                $(this).find('item').each(function(){
                    var data = {
                        Outside: true,
                        Title: $(this).find('title')[0].textContent,
                        Link: $(this).find('link')[0].textContent,
                        Description: $(this).find('description')[0].textContent
                    }
                    var html = template(data);
                    $("#outsideOnlineFeedItems").append(html);
                    $("#aggregateFeedItems").append(html);
                });
            });
        }
    });
    // $.ajax({
    //     type: 'GET',
    //     url: Config.outside['outsideAdventure'],
    //     dataType: 'xml',
    //     error: function() {
    //     alert('Unable to load feeds');
    // },
    //     success: function(xml) {
    //         console.log(xml);
    //     }
    // });
    // $.ajax({
    //     type: 'GET',
    //     url: Config.outside['outsideCulture'],
    //     dataType: 'xml',
    //     error: function() {
    //     alert('Unable to load feeds');
    // },
    //     success: function (xml) {
    //             $(xml).find("item").each(function () {
    //                 var title = $(this).find("title").text();
    //                 var description = $(this).find("description").text();
    //                 var linkUrl = $(this).find("link_url").text();
    //                 var link = "<a href='" + linkUrl + "' target='_blank'>Read More<a>";
    //                 $('#feedContainer').append('<article><h3>'+title+'</h3><p>'+description+link+'</p>');
    //             });
    //     }
    // });
    // $.ajax({
    //     type: 'GET',
    //     url: Config.outside['outsideTravel'],
    //     dataType: 'xml',
    //     error: function() {
    //     alert('Unable to load feeds');
    // },
    //     success: function(xml) {
    //         console.log(xml);
    //     }
    // });

    //$('ul.tabs').tabs();
});
