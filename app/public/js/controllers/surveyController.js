Survey.Survey.cssType = "bootstrap";

var surveyJSON = {
    completedHtml: "<center><h1>Test Complete</center></h1>",
    pages: [
    {name: "page1",
        elements: [
        {type: "html", name: "text1",
        html: "<h5>Please read the story below:</h5><br><br>" +
        "Once upon a time there lived a lion in a forest. One day after a heavy meal. It was sleeping under a tree. After a while, there came a mouse and it started to play on the lion. Suddenly the lion got up with anger and looked for those who disturbed its nice sleep. Then it saw a small mouse standing trembling with fear. The lion jumped on it and started to kill it. The mouse requested the lion to forgive it. The lion felt pity and left it. The mouse ran away. On another day, the lion was caught in a net by a hunter. The mouse came there and cut the net. Thus it escaped. There after, the mouse and the lion became friends. They lived happily in the forest afterwards.<br/><br/>"}
        ]},
    {name: "page2",
        elements: [
        {
            type: "text",
            name: "question1",
            isRequired: true,
            title: "What was the last word in the story you had just read?"
        }
        ]},
    {name: "page3",
        elements: [
        {type: "html", name: "text2",
        html: "<h5>Take some time memorize the <b>3</b> words below:<br><br></h5>" +
        "<center><h4>Apple, Table, Penny</h4></center>"}
        ]},
    {name: "page4",
        elements: [
            {
                type: "text",
                name: "question2",
                isRequired: true,
                title: "Write any complete sentence"
            }
    ]},
    {name: "page5",
    elements: [
        {
            type: "text",
            name: "question3",
            isRequired: true,
            title: "What were the 3 words I asked you to memorize?"
        }
    ]},
    ],
    showPageTitles: false,
    showProgressBar: "top"
    }

var survey = new Survey.Model(surveyJSON);