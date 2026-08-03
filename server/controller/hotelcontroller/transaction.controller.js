import mongoose from "mongoose";
import Folio from "../../models/folio.js"
import TransactionModel from "../../models/transaction.js";

let CreateTransaction = async (req, res) => {

  let session = await mongoose.startSession()
  try {
    let { folioid } = req.params;
    let { amount, paymentmode, modeid, remarks,guestid,hotelid } = req.body;
    console.log(req.body)
    let paymentModeEnum = TransactionModel.schema.path("modeOfPayment").enumValues;

    if (!folioid || !mongoose.Types.ObjectId.isValid(folioid)) {
      return res.status(400).json({
        message: "Folio Id is not valid",
      });
    }

    if(!guestid || !mongoose.Types.ObjectId.isValid(guestid) || !hotelid || !mongoose.Types.ObjectId.isValid(hotelid)){
      return res.status(400).json({
        message: "Invalid guestid or hotelid",
      });
    }

    if(!paymentmode || !paymentModeEnum.includes(paymentmode.trim())){
      return res.status(400).json({
        message:"Invalid Payment Mode"
      })
    }

    if(paymentmode && paymentmode.trim()!=="cash" && !modeid){
      return res.status(400).json({
        message:"Mode Id Is Required"
      })
      

    }

    if(!remarks){
      return res.status(400).json({
        message:"Remarks required"
      })

    }

    let isValidAmount = amount && Number.isInteger(Number(amount)) && Number(amount)>0 
   

    if(!isValidAmount){
       return res.status(400).json({
        message:"Invalid Amount"
      })

    }

    session.startTransaction()
    let folioDocument = await Folio.findOne({
      _id:folioid,
      guest:guestid,
      hotel:hotelid,
      
    })

    if(!folioDocument){
      return res.status(400).json({
        message: "Invalid guestid or hotelid",
      });
    }

    if(folioDocument.status==="closed" || folioDocument.status==="transferred" ){
       return res.status(400).json({
        message: "this folio is closed so cannot make changes in this",
      });
    }
    let dueAmount = Number(folioDocument.totalAmount) - Number(folioDocument.amountPaid);

    if(Number(folioDocument.totalAmount) - (Number(folioDocument.amountPaid) + Number(amount))==0){
      folioDocument.status="closed"
      await folioDocument.save({session})
    }

     if(Number(amount)<=0 || Number(amount)>dueAmount){
      return res.status(400).json({
        message:"The Amount most not greater than the due amount"
      })

     }

     if(dueAmount ==0){
      return res.status(400).json({
        message:"Action cannot be performed since due amount is 0"
      })

     }

    let newTransaction = new TransactionModel({
      status:"successful",
      folioid:folioDocument._id,
      amount:Number(amount),
      txnType:"normal",
      receivedBy:req.user._id,
      modeOfPayment:paymentmode,
      remarks:remarks,
      paymentModeId:modeid
    })

   await newTransaction.save({session});

   folioDocument.amountPaid = folioDocument.amountPaid + Number(amount);

   await folioDocument.save({session});

  

   await session.commitTransaction()

   return res.status(201).json({
    message:"Transaction created"
   })


  } catch (err) {
    if(session.inTransaction()){
      await session.abortTransaction()
    }
    if(err){
      return res.status(500).json({
        message:err.message|| err.data.message||"internal server error"
      })
    }
  }
  finally{
    await session.endSession()
  }
};


export{
  CreateTransaction

}
