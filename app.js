$(document).ready(function(){
  //ntc-sample-data json verilerin ajax yöntemi ile çekilmesi ve manipule işlemleri.
  (function () {
    $.ajax({
      'url': "./ntc-sample-data.json",
      'dataType': "json",
      'success': function (dataSourceArray) {
        $.each(dataSourceArray.items, function( index, value ) {
          value.totalPrice = Number((value.productPrice * value.qnty)).toLocaleString("tr",{minimumFractionDigits:2, maximumFractionDigits:2});//ürün birim fiyat ve adet çarpımı sonrasında formatla işlemi
          value.productPrice = parseFloat(value.productPrice).toLocaleString("tr",{minimumFractionDigits:2, maximumFractionDigits:2});//Birim fiyat para birimi formatlanması
         
      });
        NTCTABLE_VIEW.GROUP = "all"; //all parametresi ile table header tagı kullanılmaması.
        let ntcTable = new NTCTable(dataSourceArray,["Ürün kodu", "Ürün adı", "Birim Fiyat(TL)", "Adet", "Fiyat(TL)"]);//NTCtable instance başlatılması ve veri parametrelerin gönderilmesi. 
        let htmlTable = ntcTable.generateInnerHtmlCode();//Html şablonu fonksiyon ile tetiklenip hazırlanması
        $("#tableContainer").html(htmlTable);//html table container içine oluşan şablonu implementesi
        tableTotalPrice(ntcTable);//
      },
      'error': function(error){
          console.log('err',error);
      }
    });
  })();
})

function tableTotalPrice(ntcTable){
  

  let totalPrice = 0;
  //ntcTable instance'de bulunan rows items daki verileri loop işlemi
  $.each(ntcTable.rows.items, function( index, value ) {
      totalPrice += localeParseFloat(value.cellsArray[4].cellData);//total price işlemi için localeParseFloat() fonksiyonu parametre olarak gönderilmesi ve splite ve replace methodu ile formatlamak.
  }); 
  let totalPriceResult = (totalPrice.toLocaleString("tr") + 0).replace(/(,\d+)/gm,'<span style="font-size:32px;font-weight:300">$1</span>');//Totoal price ',' 'den sonraki parabirimi span içine alınması
  totalPriceResult +=  '<span style="font-size:30px;margin-left:10px">TL</span>';//Totoal price ',' 'den sonraki parabirimi span içine alınması
  
   $('#totalPrice').html(totalPriceResult);//total price sonucunun html olarak totalPrice div'e yazılması

   $('#numberToText').html( '<b>Yalnız</b>' + numberToText(totalPrice.toString() + 0, "."));//Total price da çıkan sonucu parametre olarak gönderilmesi ve switch case yapısı ile basak değerinin işleme alınması.
   

}

//NTCtable instance da bulun rows propertisindeki cellData bulunan ürün fiyatlarının format işlemei sonrasu parseFloat edilemesi.
function localeParseFloat(str, decimalChar, separatorChar){
  let result = [];
  str.split(",").map(function(x){
    x = x.replace(".", "");
    result.push(x);
  })
  result = result.join(".");
  return parseFloat(result);
  }


function numberToText(sayi, separator) {
  let sayarr = sayi.split(separator);
  let str = "";
  //birler ve onlar basamağına göre array oluşturulması
  let items = [
      ["", ""],
      ["BİR", "ON"],
      ["İKİ", "YiRMi"],
      ["ÜÇ", "OTUZ"],
      ["DÖRT", "KIRK"],
      ["BEŞ", "ELLİ"],
      ["ALTI", "ALTMIŞ"],
      ["YEDİ", "YETMİŞ"],
      ["SEKİZ", "SEKSEN"],
      ["DOKUZ", "DOKSAN"]
  ];
  //split edilen değerin basamak değerlerine göre işleme alınması
  for (item = 0; item < sayarr.length; item++) {
      for (basamak = 1; basamak <= sayarr[item].length; basamak++) {
          basamakDegeri = 1 + (sayarr[item].length - basamak);
          try {
              switch (basamakDegeri) {
              case 6:
                  str = str + " " + items[sayarr[item].charAt(basamak - 1)][0] + " YÜZ";
                  break;
              case 5:
                  str = str + " " + items[sayarr[item].charAt(basamak - 1)][1];
                  break;
              case 4:
                  if (items[sayarr[item].charAt(basamak - 1)][0] != "BIR") str = str + " " + items[sayarr[item].charAt(basamak - 1)][0] + " BiN";
                  else str = str + " BiN";
                  break;
              case 3:
                  if (items[sayarr[item].charAt(basamak - 1)][0] == "") {
                      str = str + "";

                  }
                  else if(items[sayarr[item].charAt(basamak - 1)][0] != "BiR") 
                    str = str + " " +           items[sayarr[item].charAt(basamak - 1)][0] + " YüZ";
                  else 
                    str = str + " YüZ";
                  break;
              case 2:
                  str = str + " " + items[sayarr[item].charAt(basamak - 1)][1];
                  break;
              default:
                  str = str + " " + items[sayarr[item].charAt(basamak - 1)][0];
                  break;
              }
          } catch (err) {
              console.log(err);
              break;
          }
      }
      //split edilen değerin for döngüsünden gelen değere göre 'Lira, Kuruş' şart verilmesi.
      if (item == 0) str = str + " LİRA";
      else {
          if (sayarr[1] != "00") str = str + " KURUŞ";
      }
  }
  return str.toLocaleLowerCase();
}