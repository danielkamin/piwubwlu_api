const Joi = require('joi');

exports.WorkshopTypeValidation = (data) => {
  const schema = Joi.object({
    id:Joi.number(),
    name: Joi.string().min(5).required(),
    english_name: Joi.string().min(5),
    symbol: Joi.string().min(1).max(3).required(),
  });
  return schema.validate(data);
};
exports.MachineValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    english_name: Joi.string().min(5).required(),
    timeUnit: Joi.any().valid('15','30','45','60').required(),
    maxUnit:Joi.number().min(1).max(20).required(),
    machineState: Joi.boolean().required(),
    workshopId: Joi.number().required(),
    additionalInfo:Joi.string().max(200)
  });
  return schema.validate(data);
};
exports.LabValidation = (data) => {
  const schema = Joi.object({
    id:Joi.number(),
    name: Joi.string().min(4).required(),
    english_name: Joi.string().min(4).required(),
    employeeId:Joi.any()
  });
  return schema.validate(data);
};
exports.WorkshopValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    english_name: Joi.string().min(5).required(),
    room_number: Joi.string().required(),
    typeId: Joi.any(),
    labId: Joi.any().required(),
    employees: Joi.array(),
    additionalInfo:Joi.string().max(200)
  });
  return schema.validate(data);
};
exports.ReservationValidation = (data) => {
  const schema = Joi.object({
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().min(Joi.ref('start_date')),
    employeeId: Joi.number().required(),
    machineId: Joi.number().required(),
  });
  return schema.validate(data);
};
exports.EmployeeProfileValidation = (data)=>{
  const schema = Joi.object({
    information: Joi.string().max(200),
  })
  return schema.validate(data)
}
exports.DepartmentValidation = (data)=>{
  const schema = Joi.object({
    id:Joi.number(),
    name: Joi.string().max(40),
    english_name: Joi.string().max(40),
  })
  return schema.validate(data)
}
exports.TimeValidation = data=>{
  const schema = Joi.object({

  })
  return schema.validate(data)
}

exports.DegreeValidation = data=>{
  const schema = Joi.object({
    id:Joi.number(),
    name: Joi.string().max(30),
  })
  return schema.validate(data)
}