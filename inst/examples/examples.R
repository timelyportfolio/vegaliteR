\dontrun{
  
library(vegaliteR)

spec <- jsonlite::fromJSON(
'
{
  "data": {
    "values": [
      {"x":"A", "y":28}, {"x":"B", "y":55}, {"x":"C", "y":43},
      {"x":"G", "y":19}, {"x":"H", "y":87}, {"x":"I", "y":52},
      {"x":"D", "y":91}, {"x":"E", "y":81}, {"x":"F", "y":53}
    ]
  },
  "marktype": "bar",
  "encoding": {
    "y": {"type": "quantitative", "field": "y"},
    "x": {"type": "ordinal", "field": "x"}
  }
}
' ,
  simplifyDataFrame = FALSE
)

spec2 <-   list(
  "data" = list(
    "values" = list(
      list("a"="A", "b"=28),
      list("a"="B", "b"=55),
      list("a"="C", "b"=43),
      list("a"="D", "b"=91),
      list("a"="E", "b"=81),
      list("a"="F", "b"=53),
      list("a"="G", "b"=19),
      list("a"="H", "b"=87),
      list("a"="I", "b"=52)
    )
  ),
  "marktype" = "bar",
  "encoding" = list(
    "x" = list("type" = "ordinal","field" = "a"),
    "y" = list("type" = "quantitative","field" = "b")
  )
)
  
vegalite(spec)
# render with canvas instead of svg
vegalite(spec,"canvas")
vegalite(spec2)


# use rlist handy list.parse function
#  to convert data.frames to list

library(rlist)
library(pipeR)

vegalite(
  list(
    data = list(
      values = mtcars %>>%
                (
                  data.frame(
                    name = rownames(.),
                    .,
                    stringsAsFactors = FALSE
                  )
                ) %>>%
                list.parse %>>%
                unname()
    ),
    marktype = "bar",
    encoding = list(
      "x" = list("field" = "cyl","type" = "O"),
      "y" = list("field" = "qsec","type" = "Q",aggregate = "mean")
    )
  )
)




library(V8)

ctx <- new_context(global = "module")
ctx$source("https://rawgit.com/vega/vega-lite/master/gallery/examples.js")
specs <- ctx$get("EXAMPLES",simplifyDataFrame = FALSE)

vegalite(specs[[1]]$spec)

# if data not in json file could do this
library(htmltools)

browsable(tagList(
  lapply(specs,vegalite)
))


}

