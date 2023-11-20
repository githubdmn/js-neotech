import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { WalletService } from "./wallet.service";
import { ProcessorService } from "../processor/processor.service";
import { TransactionDto, UpdateCustomerDTO } from "@/dto";
import { Customer, CustomerDocument } from "../../models";
import { getModelToken } from "@nestjs/mongoose";
import mongoose from "mongoose";

const mockProcessorService = {
  processTransactions: jest.fn(),
};

const mockCustomerModel = {
  findById: jest.fn(),
  deleteOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

const mockCustomer: Partial<CustomerDocument> = {
  _id: "1",
  first_name: "John",
  last_name: "Doe",
  balance: 500,
};

mockCustomerModel.findById.mockReturnValueOnce(mockCustomer);

describe("WalletService", () => {
  let walletService: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        { provide: ProcessorService, useValue: mockProcessorService },
        { provide: getModelToken(Customer.name), useValue: mockCustomerModel },
      ],
    }).compile();

    walletService = module.get<WalletService>(WalletService);
  });

  describe("processTransactions", () => {
    it("should call processorService with the correct data", async () => {
      const transactions: TransactionDto[] = [
        { value: 100, latency: 300, customerId: "aaa" },
        { value: 50, latency: 200, customerId: "aaa" },
      ];

      await walletService.processTransactions(transactions);

      expect(mockProcessorService.processTransactions).toHaveBeenCalledWith(
        transactions
      );
    });
  });

  describe("getCustomerDetails", () => {
    it("should return customer details if customer exists", async () => {
      const result = await walletService.getCustomerDetails("1");
      expect(result).toEqual({
        _id: "1",
        first_name: "John",
        last_name: "Doe",
        balance: 500,
      });
    });

    it("should throw NotFoundException if customer does not exist", async () => {
      mockCustomerModel.findById.mockReturnValueOnce(null);

      await expect(walletService.getCustomerDetails("2")).rejects.toThrowError(
        NotFoundException
      );
    });
  });

  describe("deleteCustomer", () => {
    it("should delete customer and return result if customer exists", async () => {
      const deleteResult = { deletedCount: 1 };

      mockCustomerModel.deleteOne.mockReturnValueOnce(deleteResult);

      const result = await walletService.deleteCustomer("1");

      expect(result).toEqual(deleteResult);
    });

    it("should throw NotFoundException if customer does not exist", async () => {
      const deleteResult = { deletedCount: 0 };

      mockCustomerModel.deleteOne.mockReturnValueOnce(deleteResult);

      await expect(walletService.deleteCustomer("2")).rejects.toThrowError(
        NotFoundException
      );
    });
  });

  describe("updateCustomer", () => {
    it("should update customer and return result", async () => {
      const updateData: UpdateCustomerDTO = {
        first_name: "Updated Name",
        last_name: "Updated LAST",
        balance: 0,
      };
      const updateResult = { _id: "1", name: "Updated Name", balance: 500 };

      mockCustomerModel.findByIdAndUpdate.mockReturnValueOnce(updateResult);

      const result = await walletService.updateCustomer("1", updateData);

      expect(result).toEqual(updateResult);
    });
  });
});
