var _option = "cant";
var _cantidad = "0";
var _precio = "0";
var _descuento = "0";
var _idProduct = null;

function clickButton(value, type) {
  console.log(
    "ANTES opccion: ",
    _option,
    "cant: ",
    _cantidad,
    "desc: ",
    _descuento,
    "precio: ",
    _precio
  );

  switch (type) {
    case "option":
      $(".btn_select").removeClass("btn_select");
      $("#" + value).addClass("btn_select");
      _option = value;
      break;
    case "num":
      switch (_option) {
        case "cant":
          _cantidad =
			_cantidad != "0" ? _cantidad + value.toString() : value.toString();
			$('#cant' + _idProduct).html(_cantidad);
          break;
        case "desc":
          _descuento =
            _descuento != "0"
              ? _descuento + value.toString()
              : value.toString();
          break;
        case "precio":
          if (_precio != "0") {
            if (_precio.indexOf(".00") == -1) {
              _precio = _precio + value.toString();
            } else {
              _precio = _precio.replace(".00", "." + value.toString());
            }
          } else {
            _precio = value.toString();
          }
      }
      break;
    case "delete":
      switch (_option) {
        case "cant":
          let aux_cant = _cantidad.slice(0, -1);
          _cantidad = aux_cant === "" ? "0" : aux_cant;
          break;
        case "desc":
          let aux_desc = _descuento.slice(0, -1);
          _descuento = aux_desc === "" ? "0" : aux_desc;
          break;
        case "precio":
          let aux_prec = _precio.slice(0, -1);
          _precio = aux_prec === "" ? "0" : aux_prec;
      }
      break;
    case "coma":
      switch (_option) {
        case "precio":
          let aux_prec = _precio.toString();
          _precio =
            aux_prec.indexOf(value) == -1 ? aux_prec + value + "00" : aux_prec;
      }
      break;

    default:
      return value;
  }

  console.log(
    "DESPU opccion: ",
    _option,
    "cant: ",
    _cantidad,
    "desc: ",
    _descuento,
    "precio: ",
    _precio
  );
}

$(document).ready(function() {
  $(".inner-content-product").slimScroll({
    height: "250px"
  });

  var items = [];
  let aux = [];

  $(".product-tag").click(function() {
    if (aux.indexOf(parseInt(this.id)) < 0) {
      $.ajax({
        url: "/prueba",
        data: {
          id: this.id
        },
        type: "GET",
        dataType: "json",
        traditional: true,
        success: function(data) {
          items.push({
            id: data.id,
            name: data.name,
            price: data.price,
            cant: 1
          });
          items.map(currentvalue => {
            if (aux.indexOf(parseInt(currentvalue.id)) < 0) {
              let total = currentvalue.cant * currentvalue.price;
              var html =
                "<li id=" + currentvalue.id + " class='clickItemProduct'>";
              html += "<div>";
              html += "<h4>" + currentvalue.name + "</h4>";
              html +=
                '<p id="cant' +
                currentvalue.id +
                '" class="content-p">' +
                currentvalue.cant +
                "</p>";
              html +=
                "<span>Unidad(es) en " + currentvalue.price + " BsS / </span>";
              html +=
                '<strong id="total' +
                currentvalue.id +
                '">' +
                total +
                " BsS </strong>";
              html += "</div>";

              html += "</li>";
              $(".content-ul").append(html);
            }
          });
          aux.push(data.id);
        },
        error: function(data) {
          alert("Erreur");
        }
      });
    } else {
      let temp = aux.indexOf(parseInt(this.id));
      items[temp].cant++;
      let total = items[temp].cant * items[temp].price;
      $("#cant" + items[temp].id).html(items[temp].cant);
      $("#total" + items[temp].id).html(total + " BsS");
    }
  });

  $(document).on("click", ".clickItemProduct", function() {
    _idProduct = this.id;
  });
});
