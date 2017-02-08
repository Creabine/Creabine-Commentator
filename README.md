# Creabine Carousel
## 介绍
一款简单的评论轮播展示插件
## 使用
1 引用文件：

`<link rel="stylesheet" href="Creabine-Commentator.css">`

`<script src="Creabine-Commentator.js"></script> `
    
2 添加标签：

`<div id="root"></div>`

3 js调用：

```
var Commentator = new CreabineCommentator({
      root: "root",
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
| comments      | Object array | NaN             |  yes       |
| logos         | Array    	   | NaN             |  yes       |
| width         | number 	   | 300             |  no        |
| height        | number       | 105             |  no        |
| sizeRate		| number       | 7 / 20          |  no        |
| scaleRate	    | number       | 10 / 13         |  no        |
| movePerVal	| number       | 30              |  no        |
| btn	    	| boolean      | false           |  no        |
| autoScroll	| boolean      | false           |  no        |
| scrollDuration| number       | 5000            |  no        |