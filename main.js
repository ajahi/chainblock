const csv= require('csv-parser')
const fs=require('fs');
const { parse } = require('path');
const request = require('request');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})
const readable=fs.createReadStream('transactions.csv');
const parsestream=readable.pipe(csv());




let BTCsum=0;
let Esum=0;
let Xsum=0;
let parseDate=0;//this is to parse input date
let validDataUnderInputdate=0;

let sum=0

let BTCvalue=0
let ETHvalue=0;
let XRPvalue=0;
const secretKey='bea66d2297af44dec394597b938dfa3f08c3f3b72b232da36e9366bebb9d79e6';

const main=function mainFunction(data){
    //   console.log(data.timestamp,parseDate/1000)
    //     console.log(data.timestamp<parseDate/1000)
    if(parseDate/1000 >= data.timestamp){
        validDataunderdate++;
        if(data.token==='BTC'&&data.transaction_type==='DEPOSIT'){
            BTCsum+=+data.amount;
        }
        else if(data.token==='BTC'&&data.transaction_type==='WITHDRAWAL'){
            BTCsum-=+data.amount;
        }
        else if(data.token==='XRP'&&data.transaction_type==='DEPOSIT'){
            Xsum+=+data.amount;
        }
        else if(data.token==='XRP'&&data.transaction_type==='WITHDRAWAL'){
            Xsum-=+data.amount;
        }
        else if(data.token==='ETH'&&data.transaction_type==='DEPOSIT'){
            Esum+=+data.amount;
        }
        else if(data.token==='ETH'&&data.transaction_type==='WITHDRAWAL'){
            Esum-=+data.amount;
        }
    }                        
}


const mainFunction=function (){
    readline.question(`\n
    Enter 1:,for no parameters, returns the latest portfolio value per token in USD.\n
    Enter 2:,for a token, returns the latest portfolio value for that token in USD.\n
    Enter 3:,for a date, returns the portfolio value per token in USD on that date.\n
    Enter 4:,for a date and a token, returns the portfolio value of that token in USD on that date.\n
    
 `,(inp)=>{
     switch(inp){
         case '1':
             parsestream.on('data',(data)=>{
                validDataUnderInputdate++;
                 if(data.token==='BTC'&&data.transaction_type==='DEPOSIT'){
                     BTCsum+=+data.amount;
                 }
                 else if(data.token==='BTC'&&data.transaction_type==='WITHDRAWAL'){
                     BTCsum-=+data.amount;
                 }
                 else if(data.token==='XRP'&&data.transaction_type==='DEPOSIT'){
                     Xsum+=+data.amount;
                 }
                 else if(data.token==='XRP'&&data.transaction_type==='WITHDRAWAL'){
                     Xsum-=+data.amount;
                 }
                 else if(data.token==='ETH'&&data.transaction_type==='DEPOSIT'){
                     Esum+=+data.amount;
                 }
                 else if(data.token==='ETH'&&data.transaction_type==='WITHDRAWAL'){
                     Esum-=+data.amount;
                 }
             })
             .on('end',()=>{
             
                     console.log({BTCsum,Esum,Xsum})
                     const url=`https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP&tsyms=USD&api_key=${secretKey}`;
                     request({url:url},(error,res,body)=>{
                     if(!error&&res.statusCode==200){
                         const parseData=JSON.parse(body);
                         const BTCvalue=parseData['BTC']['USD']*BTCsum;
                         const ETHvalue=parseData['ETH']['USD']*Esum;
                         const XRPvalue=parseData['XRP']['USD']*Xsum;

                         console.log('TotalBTCUSD: '+BTCvalue.toLocaleString(),'TotalETHUSD: '+ETHvalue.toLocaleString(),'TotalXRPUSD: '+XRPvalue.toLocaleString());

                         const Totalvalue=BTCvalue+ETHvalue+XRPvalue;
                         
                         console.log('TotalValue:USD '+Totalvalue.toLocaleString(),{validDataUnderInputdate});
                     }
                     })
                 });
             console.log('entered 1');
             readline.close();
             break;
         case '2':
             readline.question('Enter Token:',(input2)=>{
                 const token=input2;
                 parsestream.on('data',(data)=>{
                    if(data.token===token&&data.transaction_type==='DEPOSIT'){
                        sum+=+data.amount;
                        validDataUnderInputdate++;
                    }
                    else if(data.token===token&&data.transaction_type==='WITHDRAWAL'){
                        sum-=+data.amount;
                        validDataUnderInputdate++;
                    }
                    
                 }).on('end',()=>{
                    const url=`https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=USD&api_key=${secretKey}`;
                    request({url:url},(error,res,body)=>{
                    if(!error&&res.statusCode==200){
                        const parseData=JSON.parse(body);
                 
                        const Totalvalue=parseData['USD']*sum;
                        console.log('Total value of '+ input2 +': $'+Totalvalue.toLocaleString(),`, Total num token ,${validDataUnderInputdate}`);
                    }
                    })
                });
                 readline.close();
             })
             
             break;
         case '3':
            readline.question(`Enter Date? \n date must be of valid format in GMT,i.e:01 Jan 1970 00:00:00 GMT\n`,( date => {
                parseDate=Date.parse(date);
                console.log(`Date in Epoch ${parseDate/1000}`)
                parsestream.on('data',(data)=>{
                    if(parseDate/1000 >= data.timestamp){
                        validDataUnderInputdate++;
                        if(data.token==='BTC'&&data.transaction_type==='DEPOSIT'){
                            BTCsum+=+data.amount;
                        }
                        else if(data.token==='BTC'&&data.transaction_type==='WITHDRAWAL'){
                            BTCsum-=+data.amount;
                        }
                        else if(data.token==='XRP'&&data.transaction_type==='DEPOSIT'){
                            Xsum+=+data.amount;
                        }
                        else if(data.token==='XRP'&&data.transaction_type==='WITHDRAWAL'){
                            Xsum-=+data.amount;
                        }
                        else if(data.token==='ETH'&&data.transaction_type==='DEPOSIT'){
                            Esum+=+data.amount;
                        }
                        else if(data.token==='ETH'&&data.transaction_type==='WITHDRAWAL'){
                            Esum-=+data.amount;
                        }
                    }
                }).on('end',()=>{
             
                    console.log({BTCsum,Esum,Xsum})
             
                    const url=`https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=1&toTs=${parseDate/1000}&api_key=${secretKey}`;
                    const url2=`https://min-api.cryptocompare.com/data/v2/histoday?fsym=ETH&tsym=USD&limit=1&toTs=${parseDate/1000}&api_key=${secretKey}`;
                    const url3=`https://min-api.cryptocompare.com/data/v2/histoday?fsym=XRP&tsym=USD&limit=1&toTs=${parseDate/1000}&api_key=${secretKey}`;
                    
                    request({url:url},(error,res,body)=>{
                        if(!error&&res.statusCode==200){
                            const parseData=JSON.parse(body);
                            BTCvalue=parseData['Data']['Data'][0]['close']*BTCsum;
                            console.log(parseData['Data']['Data'][0]['close']);
                            console.log(`Total value of BTC $${BTCvalue.toLocaleString()}`);
                           
                            request({url:url2},(error,res,body2)=>{
                                if(!error&&res.statusCode==200){
                                    const parseData2=JSON.parse(body2);
                                    ETHvalue=parseData2['Data']['Data'][0]['close']*Esum;
                                    console.log(parseData2['Data']['Data'][0]['close']);
                                    console.log(`Total value of ETH $${ETHvalue.toLocaleString()}`);    

                                    request({url:url3},(error,res,body)=>{
                                        if(!error&&res.statusCode==200){
                                            const parseData=JSON.parse(body);
                                            XRPvalue=parseData['Data']['Data'][0]['close']*Xsum;
                                            console.log(parseData['Data']['Data'][0]['close']);
                                            console.log(`Total value of XRP $${XRPvalue.toLocaleString()}`);  
                                            
                                            const Totalvalue=XRPvalue+BTCvalue+ETHvalue;
                                            console.log(`Total value of all the token in date: ${date} is $:${Totalvalue.toLocaleString()}`)
                                            console.log(`Valid number of data under input date ${validDataUnderInputdate}`)
                                        }
                                        })   
                                }
                                })
                        }
                        })
                    
                         
                })
                
                readline.close();
            }));
             break;
         case '4':
            readline.question(`Enter Date? \n date must be of valid type in GMT,i.e:01 Jan 1970 00:00:00 GMT\n
                                For BTC enter date after 2009,For ETH enter date after 2015,for XRP enter date after 2012.
            `,( date => {
                sum=0;
                parseDate=Date.parse(date);
                
                readline.question(`Enter Token:\n`,(input3=>{
                    const token=input3;
                    parsestream.on('data',(data)=>{
                        if(parseDate/1000 >= data.timestamp){
                            
                            validDataUnderInputdate++;
                            if(data.token===token&&data.transaction_type==='DEPOSIT'){
                                sum+=+data.amount;
                            }
                            else if(data.token===token&&data.transaction_type==='WITHDRAWAL'){
                                sum-=+data.amount;
                            }
                            
                        }
                    }).on('end',()=>{
                        const url=`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${token}&tsym=USD&limit=1&toTs=${parseDate/1000}&api_key=${secretKey}`;
                        request({url:url},(error,res,body)=>{
                            if(!error&&res.statusCode==200){
                                const parseData=JSON.parse(body);
                           
                                
                                
                               const BTCvalue=parseData['Data']['Data'][0]['close']*sum;
                               console.log('Total coin:',{sum});
                               console.log('In date ' + date + token +' value was:' + parseData['Data']['Data'][1]['close']);
                                        console.log('Total value of '+ input3 +': $'+BTCvalue.toLocaleString()+` for ${date}`);
                                
                            }
                        })
                    });
                    readline.close();
                }))
                
            }));
             break;
        
         default:
             console.log('Only enter num 1-4');
     }
     mainFunction();
     
 });
} 
mainFunction();