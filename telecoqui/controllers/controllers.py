# -*- coding: utf-8 -*-
from odoo import http, _
from odoo.http import request
from datetime import datetime

import json

class Telecoqui(http.Controller):
    @http.route(['/quotations'], type='http', auth='public', website=True)
    def quotations(self, **kw):
        products = request.env['product.product'].search([])
        partners = request.env['res.partner'].search([('customer','=','true')])
        return request.render('telecoqui.homepage', {
            'products': products, 
            'partners' : partners,
        })

    @http.route(['/prueba'], type='http', auth="public", methods=['GET'], website=True, csrf=False)
    def prueba(self, **post):
        taxes = request.env['account.tax'].search([('type_tax_use','=','sale')])
        if (post.get('id')):
            product = request.env['product.product'].browse(int(post.get('id')))
            aux = {
                'id': product.id,
                'name': product.name,
                'price': product.list_price,
            }          
        return json.dumps(aux)

    @http.route(['/taxes'], type='http', auth="public", methods=['GET'], website=True, csrf=False)
    def get_taxes(self, **post):
        aux = []
        taxes = request.env['account.tax'].search([('type_tax_use','=','sale')])
        for x in taxes:
            aux.append({
                'id': x.id,
                'name': x.name,
                'amount': x.amount
            })   
        return json.dumps(aux)
    
    @http.route(['/quotations_save'], type='http', methods=['POST'], auth='user', csrf=False)
    def set_quotations_save(self, **post):
        cotizacion = request.env['sale.order'].create({
            'partner_id': int(post.get('customer_id')),
            'date_order': datetime.today(),
        }).id

        products = json.loads(post.get('products[]'))
        for product in products:
            print( '############################' )
            print( product['total'])
            print( '############################' )
            line = request.env['sale.order.line'].create({
                'order_id': int(cotizacion),
                'product_id': int(product['id']),
                'name': product['name'],
                'product_uom_qty': int(product['cant']),
                'tax_id': [(4, product['id_impuesto'])],
                'price_unit': float(product['price']),
                'price_subtotal': float(product['subtotal']),
                'price_total': float(product['total']),
            })
        return
