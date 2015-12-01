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

# sizing is unfortunately not easy
#  https://github.com/vega/vega-lite/issues/194
spec$config$cell$height = 400
spec$config$cell$width = 40
vegalite(spec)

# using an R list instead of JSON
vegalite(spec2)


# use rlist handy list.parse function
#  to convert data.frames to list

library(rlist)
library(pipeR)

mtcars %>>%
  (
    data.frame(
      name = rownames(.),
      .,
      stringsAsFactors = FALSE
    )
  ) %>>%
  list.parse %>>%
  unname() %>>%
  (
    vegalite(
      list(
        data = list(
          values = .
        ),
        marktype = "bar",
        encoding = list(
          "x" = list("field" = "cyl","type" = "O"),
          "y" = list("field" = "qsec","type" = "Q",aggregate = "mean"),
          "color" = list("field" = "cyl","type" = "O")
        )
      )
    )
  )


# http://vega.github.io/vega-editor/?mode=vega-lite&spec=stacked_bar
#  using R barley data
#{
#  "data": {"url": "data/barley.json"},
#  "marktype": "bar",
#  "encoding": {
#    "x": {"name": "yield","type": "Q","aggregate": "sum"},
#    "y": {"name": "variety","type": "N"},
#    "color": {"name": "site","type": "N"}
#  }
#}
data(barley, package = "lattice")
barley %>>%
  list.parse %>>%
  unname %>>%
  (
    list(
      data = list( values = . ),
      marktype = "bar",
      encoding = list(
        x = list(field = "yield", type = "Q", aggregate = "sum"),
        y = list(field = "variety", type = "nominal"), # can use N instead of nominal
        color = list(field = "site", type = "nominal")
      )
    )
  ) %>>%
  vegalite(width = 500)

barley %>>%
  list.parse %>>%
  unname %>>%
  (
    list(
      data = list( values = . ),
      marktype = "bar",
      encoding = list(
        x = list(field = "yield", type = "Q", aggregate = "sum"),
        y = list(field = "site", type = "nominal"),
        color = list(field = "site", type = "nominal")
      )
    )
  ) %>>%
  vegalite(width = 500)

#try with the json
barley2 <- jsonlite::fromJSON("http://vega.github.io/vega-editor/app/data/barley.json",simplifyDataFrame = FALSE)
barley2 %>>%
  (
    list(
      data = list( values = . ),
      marktype = "bar",
      encoding = list(
        x = list(field = "yield", type = "Q", aggregate = "sum"),
        y = list(field = "variety", type = "nominal"),
        color = list(field = "site", type = "nominal")
      )
    )
  ) %>>%
  vegalite(width = 500)

data(Oats, package = "MEMSS")
Oats %>>%
  list.parse %>>%
  unname %>>%
  (
    list(
      data = list(values = .),
      marktype = "bar",
      encoding = list(
        x = list(
          field = "yield",
          type = "Q",
          aggregate = "sum"
        ),
        y = list(
          field = "Variety",
          type = "nominal"
        ),
        color = list(
          field = "Block",
          type = "nominal"
        )
      )
    )
  ) %>>%
  vegalite(width = 400)


library(purrr)
diamonds %>>%
  (.[sample(1:nrow(.),5000),]) %>>%
  by_row(as.list) %>>%
  (.$.out) %>>%
  (
    list(
      data = list(values = .),
      marktype = "line",
      encoding = list(
        y = list(field = "price", type = "Q", aggregate = "mean"),
        x = list(field = "cut", type = "O"),
        color = list(field = "clarity", type = "nominal")
      )
    )
  ) %>>%
  vegalite(renderer = "canvas")

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


# can get json data this way
# manually
specs[[3]]$spec$data <- list(
  values = jsonlite::fromJSON(
    paste0("http://vega.github.io/vega-editor/app/",specs[[3]]$spec$data$url),
    simplifyDataFrame = FALSE
  )
)
vegalite(specs[[3]]$spec)

# across all with json data
specs_local <- lapply(
  specs,
  function(spec){
    if("url" %in% names(spec$spec$data)){
      spec$spec$data <- list(
        values = jsonlite::fromJSON(
          paste0(
            "http://vega.github.io/vega-editor/app/",
            spec$spec$data$url
          ),
          simplifyDataFrame = FALSE
        )
      )
    }
    spec
  }
)

browsable(tagList(
  lapply(specs_local,function(spec){vegalite(spec$spec)})
))


}

