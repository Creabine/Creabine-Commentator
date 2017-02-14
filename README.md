# Creabine Commentator
## 介绍
一款简单的评论轮播展示插件。 [example](http://creabine.info/mywebsite/demo/Creabine-Commentator.html)
## 使用
1 引用文件：

`<link rel="stylesheet" href="Creabine-Commentator.css">`

`<script src="Creabine-Commentator.js"></script> `
    
2 添加标签：

`<div id="commentatorRoot"></div>`

3 js调用：

```
var comments = [
    {
      content:'Content 1',
      commentator:'Commentator 1'
    },
    {
      content:'Content 2',
      commentator:'Commentator 2'
    },
    {
      content:'Content 3',
      commentator:'Commentator 3'
    },
    {
      content:'Content 4',
      commentator:'Commentator 4'
    },
    {
      content:'Content 5',
      commentator:'Commentator 5'
    }
];

logos = ['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg'];

var Commentator = new CreabineCommentator({
      root: "commentatorRoot",
      comments:comments,
      logos:logos,
      width:850,
      height:250,
      movePerVal:20,
      btn:true,
      autoScroll:true,
      scrollDuration:3000,
})
```

### Options
| name          | type         | default         | required   |
| --------      | ---------    |:----------:     | ----------:| 
| root          | string       | NaN             |  yes       |
| comments      | object array | NaN             |  yes       |
| logos         | array    	   | NaN             |  yes       |
| width         | number 	   | 300             |  no        |
| height        | number       | 105             |  no        |
| sizeRate		| number       | 7 / 20          |  no        |
| scaleRate	    | number       | 10 / 13         |  no        |
| movePerVal	| number       | 30              |  no        |
| btn	    	| boolean      | false           |  no        |
| autoScroll	| boolean      | false           |  no        |
| scrollDuration| number       | 5000            |  no        |
