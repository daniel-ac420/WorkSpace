/* --- Добавление title к label у input [type=checkbox] в фильтре --- */

$(".filter__form-input[type='checkbox']").each(function() {
	let text = $.trim($(this).parent().text());
//	console.log(text);
	
	$(this).parent().attr("title", text);
});



//$(".filter__form-payment-container").find(".filter__form-input").each(function() {
//	let number = $(this).value;
//	console.log(number);
//});



/* ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА */
	
	/* ПРИ КЛИКЕ ПО КНОПКЕ "X" */

//	$(".modal__close").on("click", function() {
//		$(this).parents(".modal").remove();
//		$(".modal").remove();
//	});



	/* ПРИ КЛИКЕ ВНЕ МОДАЛЬНОГО ОКНА */

//$(".modal").click(function (click) {
//	if ($(click.target).closest(".modal__body").length) {
//	// клик внутри элемента
//		return;
//	}
//	// клик снаружи элемента
//	$(".modal__body").fadeOut();
//	$(".modal").remove();
//});


	/* ПРИ НАЖАТИИ НА ESC */

	$(document).on('keyup', function(pressKey) {
		if (pressKey.key == "Escape" ) {
			$(".modal").remove();
		}
	});


/* --- Открытие / сворачивание фильтра на мобильных устройствах при клике по кнопке "Фильтр▼" --- */

$(".filter-mobile-minimize").on("click", function() {
	$(this).toggleClass("filter-mobile-minimize--active");
	$(this).siblings(".filter__form").toggleClass("filter__form--active");
});



/* --- Открытие / сворачивание фильтра на мобильных устройствах при клике по кнопке "Применить" --- */

$(window).on('load resize', function() {
	let displayWidth = $(window).width();
//		console.log(displayWidth);
		
		if (displayWidth < 769) {
			$(".filter__form-button[type='submit']").on("click", function() {
				$(this).parents(".filter__form").toggleClass("filter__form--active");
				$(this).parents(".filter__form").siblings(".filter-mobile-minimize").toggleClass("filter-mobile-minimize--active");
			});
		}
});

