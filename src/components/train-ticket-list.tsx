import React from 'react';
import { Paper, Typography, Box, Chip, IconButton, Radio } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TrainTicket, Seat } from '../types/train';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface TrainTicketListProps {
    tickets: TrainTicket[];
    onSelect?: (trainNo: string) => void;
    selectedTrainNo?: string;
}

interface SelectedTicket {
    trainNo: string;
    seatType: string;
}

export const TrainTicketList: React.FC<TrainTicketListProps> = ({
    tickets,
    onSelect,
    selectedTrainNo
}) => {
    const [selected, setSelected] = React.useState<SelectedTicket | null>(null);

    const handleSelect = (trainNo: string, seatType: string) => {
        if (onSelect) {
            onSelect(trainNo);
        }
        setSelected({ trainNo, seatType });
    };

    const renderSeat = (seat: Seat, trainNo: string) => {
        const isSelected = selected?.trainNo === trainNo && selected?.seatType === seat.type;

        return (
            <SeatInfo
                key={seat.type}
                selected={isSelected}
                onClick={(e) => {
                    e.stopPropagation();
                    if (seat.available) {
                        handleSelect(trainNo, seat.type);
                    }
                }}
                available={seat.available}
            >
                <Typography variant="body2">¥{seat.price}</Typography>
                <Chip
                    label={seat.available ? "有票" : "无票"}
                    size="small"
                    color={seat.available ? "success" : "error"}
                />
                <Typography variant="caption" color="textSecondary">
                    {seat.type}
                </Typography>
            </SeatInfo>
        );
    };

    return (
        <TicketsContainer>
            <Typography variant="h6" gutterBottom>
                车票信息
            </Typography>
            <TicketsScrollContainer>
                {tickets.map((ticket, index) => (
                    <TicketCard
                        key={index}
                        elevation={1}
                        selected={selected?.trainNo === ticket.train_no}
                        onClick={() => ticket.can_buy && handleSelect(ticket.train_no, '')}
                    >
                        <Radio
                            checked={selected?.trainNo === ticket.train_no}
                            disabled={!ticket.can_buy}
                            sx={{ mr: 1 }}
                        />
                        <TrainInfo>
                            <Typography variant="h6" color="primary">
                                {ticket.train_no}
                            </Typography>
                            <Chip label={ticket.type || "普快"} size="small" />
                        </TrainInfo>

                        <TimeInfo>
                            <Typography variant="h6">{ticket.departure_time}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                {ticket.departure_station}
                            </Typography>
                        </TimeInfo>

                        <DurationInfo>
                            <Typography variant="body2" color="textSecondary">
                                {ticket.duration}
                            </Typography>
                            <ArrowLine />
                        </DurationInfo>

                        <TimeInfo>
                            <Typography variant="h6">{ticket.arrival_time}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                {ticket.arrival_station}
                            </Typography>
                        </TimeInfo>

                        <SeatsInfo onClick={(e) => e.stopPropagation()}>
                            {ticket.seats.map(seat => renderSeat(seat, ticket.train_no))}
                        </SeatsInfo>
                    </TicketCard>
                ))}
            </TicketsScrollContainer>
        </TicketsContainer>
    );
};

const TicketsContainer = styled(Paper)({
    padding: '1rem',
    marginTop: '1rem',
});

const TicketsScrollContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    height: '160px',
    overflowY: 'auto',
    paddingRight: '8px',
    '&::-webkit-scrollbar': {
        width: '6px',
    },
    '&::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
        background: '#bbb',
        borderRadius: '3px',
        '&:hover': {
            background: '#999',
        },
    },
});

interface TicketCardProps {
    selected?: boolean;
}

const TicketCard = styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'selected',
})<TicketCardProps>(({ theme, selected }) => ({
    padding: '0.75rem',
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: selected ? '#f0f7ff' : '#fff',
    border: selected ? `1px solid ${theme.palette.primary.main}` : '1px solid transparent',
    '&:hover': {
        backgroundColor: selected ? '#f0f7ff' : '#f5f5f5',
    },
}));

const TrainInfo = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
    minWidth: '80px',
    '& .MuiTypography-h6': {
        fontSize: '1.1rem',
    },
    '& .MuiChip-root': {
        height: '24px',
    },
});

const TimeInfo = styled(Box)({
    textAlign: 'center',
    minWidth: '80px',
    '& .MuiTypography-h6': {
        fontSize: '1.1rem',
    },
});

const DurationInfo = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
});

const ArrowLine = styled('div')({
    height: '2px',
    width: '100%',
    backgroundColor: '#e0e0e0',
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        right: 0,
        top: '50%',
        width: '8px',
        height: '8px',
        borderTop: '2px solid #e0e0e0',
        borderRight: '2px solid #e0e0e0',
        transform: 'translate(0, -50%) rotate(45deg)',
    },
});

const SeatsInfo = styled(Box)({
    display: 'flex',
    gap: '0.75rem',
    minWidth: '180px',
});

interface SeatInfoProps {
    selected?: boolean;
    available?: boolean;
}

const SeatInfo = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'selected' && prop !== 'available',
})<SeatInfoProps>(({ theme, selected, available }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.2rem',
    padding: '0.35rem',
    borderRadius: '4px',
    cursor: available ? 'pointer' : 'not-allowed',
    opacity: available ? 1 : 0.5,
    backgroundColor: selected ? '#f0f7ff' : 'transparent',
    border: selected ? `1px solid ${theme.palette.primary.main}` : '1px solid transparent',
    '&:hover': {
        backgroundColor: available ? (selected ? '#f0f7ff' : '#f5f5f5') : 'transparent',
    },
    '& .MuiChip-root': {
        height: '24px',
    },
})); 