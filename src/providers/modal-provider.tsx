/* 'use client'
import { Agency } from '@/lib/types/agency.types'
import { Contact } from '@/lib/types/contact.types'
import { Subscription } from '@/lib/types/subscription.types'
import { User } from '@/lib/types/user.types'

import { createContext, useContext, useEffect, useState } from 'react'

interface ModalProviderProps {
  children: React.ReactNode
}

export type ModalData = {
  user?: User
  agency?: Agency
   ticket?: TicketDetails[0]
  contact?: Contact
  plans?: {
    defaultPriceId: Subscription
    plans: PricesList['data']
  } 
}
type ModalContextType = {
  data: ModalData
  isOpen: boolean
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => void
  setClose: () => void
}

export const ModalContext = createContext<ModalContextType>({
  data: {},
  isOpen: false,
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => {},
  setClose: () => {},
})

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<ModalData>({})
  const [showingModal, setShowingModal] = useState<React.ReactNode>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const setOpen = async (
    modal: React.ReactNode,
    fetchData?: () => Promise<any>
  ) => {
    if (modal) {
      if (fetchData) {
        setData({ ...data, ...(await fetchData()) })
      }
      setShowingModal(modal)
      setIsOpen(true)
    }
  }

  const setClose = () => {
    setIsOpen(false)
    setData({})
  }

  if (!isMounted) return null

  return (
    <ModalContext.Provider value={{ data, setOpen, setClose, isOpen }}>
      {children}
      {showingModal}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within the modal provider')
  }
  console.log("Context", context);
  return context
}

export default ModalProvider */

'use client';

import { Agency } from '@/lib/types/agency.types';
import { User } from '@/lib/types/user.types';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ModalProviderProps {
  children: React.ReactNode;
}

export type ModalData = {
  user?: User;
  agency?: Agency;
};

type ModalContextType = {
  data: ModalData;
  isOpen: boolean;
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => void;
  setClose: () => void;
};

export const ModalContext = createContext<ModalContextType | null>(null);

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ModalData>({});
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [showingModal, setShowingModal] = useState<React.ReactNode>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const setOpen = async (
    modal: React.ReactNode,
    fetchData?: () => Promise<any>
  ) => {
    console.log("🔹 setOpen triggered with modal:", modal);
  
    if (!modal) {
      console.warn("⚠️ No modal passed to setOpen");
      return;
    }
  
    let fetchedData = {};
    if (fetchData) {
      try {
        fetchedData = await fetchData();
        console.log("✅ Fetched Data:", fetchedData);
      } catch (error) {
        console.error("❌ Error fetching modal data:", error);
      }
    }
  
    setData((prev) => ({ ...prev, ...fetchedData }));
    setShowingModal(modal);
    setModalContent(modal);  // Update modalContent here
    setIsOpen(true);
  
    console.log("🔹 State after setOpen:", { isOpen: true, showingModal: modal });
  };

  const setClose = () => {
    console.log("🔹 Closing modal...");
    setIsOpen(false);
    setData({});
    setShowingModal(null);
  };

  if (!isMounted) return null;

  return (
    <ModalContext.Provider value={{ data, isOpen, setOpen, setClose }}>
      {children}
      {isOpen && modalContent}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within the ModalProvider');
  }
  
  return context;
};

export default ModalProvider;
