var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class Technician {
    // you can add your own attribute
    constructor(name, averageRepairTime) {
        this._name = name;
        this._averageRepairTime = averageRepairTime;
    }
    set name(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
    set averageRepairTime(averageRepairTime) {
        this._averageRepairTime = averageRepairTime;
    }
    get averageRepairTime() {
        return this._averageRepairTime;
    }
     async repairing(customer) {
        console.log(`>> Technician ${this.name} is repairing ${customer.name}'s phone. Customer phone is ${customer.phoneSeries} series <<`);
        return new Promise((resolve) => {
            setTimeout(() => {
                customer.repairedBy = this.name;
                console.log(`   REPAIRING DONE: ${this.name} FIXED ${customer.name}'s phone!`);
                resolve(customer);
            }, this._averageRepairTime * 1000); 
        });
    }
}
class Customer {
    constructor(name, phoneSeries) {
        // you can add your own attribute
        this.repairedBy = null;
        this._name = name;
        this._phoneSeries = phoneSeries;
    }
    set name(name) {
        this._name = name;
    }
    get name() {
        return this._name;
    }
    set phoneSeries(phoneSeries) {
        this._phoneSeries = phoneSeries;
    }
    get phoneSeries() {
        return this._phoneSeries;
    }
}
class ServiceCenter {
    constructor(name, address, technicians, customers) {
        this._repairLog = [];
        this._name = name;
        this._address = address;
        this._technicians = technicians;
        this._customers = customers;
        this._customerQueue = [...customers];
    }
    get name() {
        return this._name;
    }
    async startOperating() {
        const technicianPromises = this._technicians.map((technician) => 
            this.processQueueForTechnician(technician)
        );
        
        await Promise.all(technicianPromises);

        this.printFinalLog();
    }

    async processQueueForTechnician(technician) {
        const customer = this._customerQueue.shift();

        if (!customer) {
            return;
        }

        const repairedCustomer = await technician.repairing(customer);

        this._repairLog.push(repairedCustomer);

        if (this._customerQueue.length > 0) {
            console.log(`   ${technician.name} available, call another customer...`);
        }
        
        await this.processQueueForTechnician(technician);
    }

     printFinalLog() {
        console.log('\nService Center Log for today:');
        
        this._repairLog.sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));
        
        const formattedLog = this._repairLog.map((customer) => ({
            // '(index)': parseInt(customer.name.split(' ')[1]),
            customerName: customer.name,
            phone: customer.phoneSeries,
            phoneRepairedBy: customer.repairedBy,
        }));
        
        console.table(formattedLog);
    }
}
// ====================================================================================
// MAIN
// ====================================================================================
// Define Technician
const dalton = new Technician('Dalton', 15); // 10 seconds
const wapol = new Technician('Wapol', 25); // 20 seconds
const technicians = [dalton, wapol];
const phoneSeriesOptions = ['Jaguar', 'Leopard', 'Lion'];
// Define Customer
// Generate 10 customers
const customers = new Array(10).fill(null).map((_, index) => {
    const randomPhoneSeries = phoneSeriesOptions[Math.floor(Math.random() * phoneSeriesOptions.length)];
    return new Customer(`Customer ${index}`, randomPhoneSeries);
});
// Define Service Center
const serviceCenter = new ServiceCenter(
    'First SC', 
    'Long Ring Long Land Street', 
    technicians, 
    customers
);
console.log('Customer on queue: ');
const customerQueueTable = customers.map((customer, index) => ({
    customerName: customer.name,
    phone: customer.phoneSeries,
}));
console.table(customerQueueTable);
console.log('\n');
// Begin Operating
console.log(`${serviceCenter.name} start operating today: `);
serviceCenter.startOperating().catch(err => console.log(err));
