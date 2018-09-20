var _data = [];
var _taxes = [];
var _idTax = 0;
var _key = null;
var _option = "cant";
var _idProduct = null;
var _aux = [];

var _baseImponible = 0;
var _impuetosTotal = 0;
var _total = 0;


function subtotal_product (position) {
	var aux = 0;
	aux = parseFloat(_data[position].price) * parseFloat(_data[position].cant); 
	 _data[position].subtotal = aux.toFixed(2);
	 _data[position].monto_impuesto = parseFloat((_data[position].impuesto)/100)*parseFloat(_data[position].subtotal);
	 _data[position].total = parseFloat(_data[position].subtotal) + parseFloat(_data[position].monto_impuesto);
	return _data[position].subtotal;
}

function baseImponible () {
	var aux = 0;
	_data.map((currentvalue) => {
		if (aux == 0) {
			aux = parseFloat(currentvalue.subtotal);
		} else {
			aux += parseFloat(currentvalue.subtotal);
		}
	});
	_baseImponible = aux.toFixed(2);
	return _baseImponible;
}

function impuestoTotal(){
	var aux = 0;
	_data.map((currentvalue) => {
		if (aux == 0) {
			aux = (parseFloat(currentvalue.impuesto)/100)*parseFloat(currentvalue.subtotal);
		} else {
			aux = aux + (parseFloat(currentvalue.impuesto)/100)*parseFloat(currentvalue.subtotal);
		}
	});
	_impuetosTotal = aux.toFixed(2);
	return _impuetosTotal;
}

function total(){
	var aux_total = 0;
	aux_total = parseFloat(baseImponible()) + parseFloat(impuestoTotal());
	_total =  aux_total.toFixed(2);
	return _total;
}

function clickButton(value, type) {

	if (type == "option") {
		$(".btn_select").removeClass("btn_select");
		$("#" + value).addClass("btn_select");
		_option = value;
	} 

	if (type == "remove") {
		var product_select = $(".product-list-select");
		var id_li = product_select.closest('li')[0].id;
		var key = _aux.indexOf(parseInt(id_li));
		_aux.splice(key, 1);
		_data.splice(key, 1);
		product_select.closest('li').remove();
		$('#remove').attr("disabled", true);
	}

	if ((type == "option") && (value == "impuesto")){
		$("#select-taxes-" + _key).removeAttr("disabled");
	}

	if ((type != "option") && (_key != null)){
		switch (type) {
			case "num":
				switch (_option) {
					case "cant":
						_data[_key].cant = (_data[_key].cant != 0) ? 
											parseInt(_data[_key].cant + value.toString()) : 
											parseInt(value.toString());
						$("#select-taxes-" + _key).removeAttr("disabled");
						$('#cant' + _idProduct).html(_data[_key].cant);
						$('#subt' + _idProduct).html('Subtotal: ' + subtotal_product(_key));
						$('.base-p').html('Base imponible : '+ baseImponible());
						$('.impuesto-p').html('Impuestos : '+ impuestoTotal());	
						$('.total-p').html('Total : '+ total());

						break;
					case "precio":
						if (_data[_key].price != 0){
							if (((_data[_key].price).toString().split(".")[1]) == '00'){
								_data[_key].price = (parseFloat((_data[_key].price).toString().replace(".00", "."+value.toString()))).toFixed(1);
							} else if ( ((_data[_key].price).toString().split(".")[1]) >= '1' ) {
								_data[_key].price = (parseFloat((_data[_key].price).toString() + value.toString())).toFixed(2);
							} else {
								_data[_key].price = parseFloat((_data[_key].price).toString() + value.toString());
							}
						} else {
							_data[_key].price = parseFloat(value.toString());
						}
						$('#prec' + _idProduct).html(_data[_key].price);
						$('#subt' + _idProduct).html('Subtotal: ' + subtotal_product(_key));
						$('.base-p').html('Base imponible : '+ baseImponible());
						$('.impuesto-p').html('Impuestos : '+ impuestoTotal());	
						$('.total-p').html('Total : '+ total());
				}
				break;
			case "delete":
				switch (_option) {
					case "cant":
						var aux_cant = (_data[_key].cant).toString().slice(0, -1);
						_data[_key].cant = aux_cant === "" ? 0 : parseInt(aux_cant);
						$('#cant' + _idProduct).html(_data[_key].cant);
						$("#subt" + _idProduct).html('Subtotal: ' + subtotal_product(_key));
						$('.base-p').html('Base imponible : '+ baseImponible());
						$('.impuesto-p').html('Impuestos : '+ impuestoTotal());	
						$('.total-p').html('Total : '+ total());
						break;
					case "precio":
						var aux_prec = (_data[_key].price).toString().slice(0, -1);
						_data[_key].price = aux_prec === "" ? 0 : parseFloat(aux_prec);
						$('#prec' + _idProduct).html(_data[_key].price);
						$('#subt' + _idProduct).html('Subtotal: ' + subtotal_product(_key));
						$('.base-p').html('Base imponible : '+ baseImponible());
						$('.impuesto-p').html('Impuestos : '+ impuestoTotal());	
						$('.total-p').html('Total : '+ total());				}
				break;
			case "coma":
				switch (_option) {
					case "precio":
						var aux_precio = _data[_key].price.toString();
						_data[_key].price = aux_precio.indexOf('.') == -1 ? parseFloat(aux_precio).toFixed(2) : parseFloat(aux_precio);
						$('#prec' + _idProduct).html(_data[_key].price);
						$('#subt' + _idProduct).html('Subtotal: ' + subtotal_product(_key));
						$('.base-p').html('Base imponible : '+ baseImponible());
						$('.impuesto-p').html('Impuestos : '+ impuestoTotal());	
						$('.total-p').html('Total : '+ total());				}
				break;
			default:
				return value;
		}
	}
}

$(document).ready(function () {
	$('.js-example-basic-single').select2();

	$(".inner-content-product").slimScroll({
		height: "250px"
	});
	$(".inner-content-div").slimScroll({
		height: "300px"
	});

	$.ajax({
		url: "/taxes",
		type: "GET",
		dataType: 'json',
		traditional: true,
		success: function(data){
			data.map(currentvalue => {
				_taxes.push(currentvalue);
			})
		},
		error: function(data){
			alert("Erreur");
		}

	});

	$(".product-tag").click(function () {
		if (_aux.indexOf(parseInt(this.id)) < 0) {
			$.ajax({
				url: "/prueba",
				data: {
					id: this.id
				},
				type: "GET",
				dataType: "json",
				traditional: true,
				success: function (data) {
					_data.push({
						id: data.id,
						name: data.name,
						cant: 1,
						price: data.price,
						id_impuesto: 1,
						impuesto: 0,
						monto_impuesto: 0,
						subtotal: data.price*1,
						total: data.price*1,
					});
					_data.map((currentvalue, index) => {
						if (_aux.indexOf(parseInt(currentvalue.id)) < 0) {
							var html = "<li id=" + currentvalue.id + " value="+index+" class='clickItemProduct'>";
									html += "<h4>" + currentvalue.name + "</h4>";
									html += '<p>';
										html += '<span>Cantidad: <strong id="cant' + currentvalue.id + '">' + currentvalue.cant + '</strong></span>';
										html += '<span> / Impuesto: <strong id="impuesto' + currentvalue.id + '">';
											html += '<select class="select-taxes" id="select-taxes-' + currentvalue.id + '" name=tax-"'+currentvalue.id+'">';
												_taxes.map((currentvalueTax) =>{
													html += '<option value="' + currentvalueTax.id + '">';
														html += currentvalueTax.name;
													html += '</option>';
												});
											html += '</select>';
										html += '</strong></span>';
										html += '<span> / Precio: <strong id="prec' + currentvalue.id + '">' + currentvalue.price + '</strong></span>';
									html += '</p>';
									html += '<strong class="t-strong" id="subt' + currentvalue.id + '"> Subtotal: ' + (currentvalue.subtotal).toFixed(2) + '</strong>';
								html += "</li>";
							$(".content-ul").append(html);
						}
					});
					$('.base-p').html('Base imponible : '+ baseImponible());
					$('.impuesto-p').html('Impuestos : '+ impuestoTotal());
					$('.total-p').html('Total : '+ total());
					_aux.push(data.id);
				},
				error: function (data) {
					alert("Erreur");
				}
			});
		} else {
			var temp = _aux.indexOf(parseInt(this.id));
			_data[temp].cant++;
			$("#cant" + _data[temp].id).html(_data[temp].cant);
			$("#subt" + _data[temp].id).html('Subtotal: ' + subtotal_product(temp));
			$('.base-p').html('Base imponible : '+ baseImponible());
			$('.impuesto-p').html('Impuestos : '+ impuestoTotal());
			$('.total-p').html('Total: '+ total());
		}
	});

	$(document).on("click", ".clickItemProduct", function () {
		$(".product-list-select").removeClass("product-list-select");
		$("#" + this.id).addClass("product-list-select");
		$('#remove').attr("disabled", false);
		_idProduct = this.id;
		_key = this.value;
	});

	$(document).on('change', '.select-taxes', function(){
		_idTax = $(this).val();
		_data[_key].id_impuesto = parseInt(_idTax);

		_taxes.map((currentvalueTax) => {
			if (currentvalueTax.id == _idTax){
				_data[_key].impuesto = parseInt(currentvalueTax.amount);
			}
		});

		$('#subt' + _idProduct).html('Subtotal: ' + subtotal_product(_key));
		$('.base-p').html('Base imponible : '+ baseImponible());
		$('.impuesto-p').html('Impuestos : '+ impuestoTotal());	
		$('.total-p').html('Total : '+ total());

	});

	$(".onSubmitModal").on("click", function (e) {
		var customer_id = document.getElementById("select-value").value;
		if (customer_id === "") {
			swal("Debe seleccionar un Cliente");
		} else {
			swal({
				title: "¿Estás seguro?",
				text: "De generar esta cotización",
				icon: "warning",
				buttons: true,
				dangerMode: true
				}).then(willShow => {
					if (willShow) {
						$.ajax({
							url: '/quotations_save',
							type: 'POST',
							data: {
								'customer_id': customer_id,
								'base_imponible': _baseImponible,
								'impuesto': _impuetosTotal,
								'total': _total,
								'products[]': JSON.stringify(_data),
							},
							dataType: 'json',
							error: function(){
							    swal("Ocurrio un Error");
							},
							success:function(data){
							    swal("Se guardo exitosamente", {
							        icon: "success"
							    });
								
							}
							});
					} else {
						swal("Se ha cancelado la cotización" );
					}
			});
		}
    });

});
