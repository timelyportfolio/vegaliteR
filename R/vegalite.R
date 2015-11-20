#' Vega-lite in R
#'
#' Plot data with vega-lite from R with the convenience of
#'  htmlwidgets infrastructure.
#'
#' @example inst/examples/examples.R
#' @import htmlwidgets
#'
#' @export
vegalite <- function(spec, width = NULL, height = NULL) {

  # forward options using x
  x = list(
    spec = spec
  )

  # create widget
  htmlwidgets::createWidget(
    name = 'vegalite',
    x,
    width = width,
    height = height,
    package = 'vegaliteR'
  )
}

#' Shiny bindings for vegalite
#'
#' Output and render functions for using vegalite within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a vegalite
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name vegalite-shiny
#'
#' @export
vegaliteOutput <- function(outputId, width = '100%', height = '400px'){
  htmlwidgets::shinyWidgetOutput(outputId, 'vegalite', width, height, package = 'vegaliteR')
}

#' @rdname vegalite-shiny
#' @export
renderVegalite <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  htmlwidgets::shinyRenderWidget(expr, vegaliteOutput, env, quoted = TRUE)
}
