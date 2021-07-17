
exports.tableObject = (lab) =>{
    let tableObject = {
      table: {
        widths:['*','*','*','*'],
        style: 'tableExample',
        body: []
      }
    }
    Object.keys(lab).forEach(workshopName=>{
      const workshop = lab[workshopName]
      if(Object.keys(workshop).length!==0){
        let workshopNameRow = [] , infoRow = []
        workshopNameRow.push({text: workshopName, style: 'tableHeader', colSpan: 4, alignment: 'center'})
        workshopNameRow.push({})
        workshopNameRow.push({})
        workshopNameRow.push({})
        infoRow.push({text: 'Nazwa aparatury', alignment: 'center'})
        infoRow.push({text: 'Cel naukowy', alignment: 'center'})
        infoRow.push({text: 'Cel Dydaktyczny', alignment: 'center'})
        infoRow.push({text: 'Cel komercyjny', alignment: 'center'})

        tableObject.table.body.push(workshopNameRow)
        tableObject.table.body.push(infoRow)

        Object.keys(workshop).forEach(machineName=>{
          let machineInfoRow = []
          const machine = workshop[machineName]
          if(machine.length===3){
            machineInfoRow.push({text: machineName})
            machine.forEach(timeObject=>{
              machineInfoRow.push({text: timeObject.time})
            })
            tableObject.table.body.push(machineInfoRow)
          }
        })
      }
    })
    return tableObject
}