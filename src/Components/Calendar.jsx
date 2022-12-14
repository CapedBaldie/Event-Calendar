import { React, useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  GridItem,
  theme,
  Button,
  useToast,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import Eventdisplay from './Evendisplay';

export function Daily(props) {
  const times = [
    10.0, 10.5, 11.0, 11.5, 12.0, 12.5, 13.0, 13.5, 14.0, 14.5, 15.0, 15.5,
    16.0, 16.5, 17.0,
  ];

  const [resp, setResp] = useState();
  const [events, setEvents] = useState([]);
  const [isdelete, setIsdelete] = useState();
  const [del_id, setDel_id] = useState();
  const [del_response, setDel_response] = useState();
  var blocks = [];

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append(
      'access-token',
      'MzQ6dGVzdE1haWxAZ21haWwuY29tOkFkbWluOjM4ZDkzN2YxLTU1MGUtNDFmNy1iZTZiLTg1OGNkNzVjNGE4ZQ=='
    );
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Access-Control-Allow-Origin', '*');

    var raw = JSON.stringify({
      merchant_id: 'GR-JBXJEK',
      from_date: props.dateQ,
      to_date: props.dateQ,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      'http://pawsensetest2-env.eba-rtpxdxih.ap-south-1.elasticbeanstalk.com/api/block/get_blocks_by_merchant',
      requestOptions
    )
      .then(response => response.json())
      .then(result => {
        setResp(result);
        //console.log(result);
      })
      .catch(error => console.log('error', error));

    {/* creating event block array and setting it to events */}
    if (resp != null) {
      {
        resp.data[props.dateQ]?.map(b => {
          blocks.push({
            id: b.block_id,
            start: b.from_time.substring(0, 5),
            end: b.to_time.substring(0, 5),
            h:
              (dayjs(props.dateQ + ' ' + b.to_time).diff(
                dayjs(props.dateQ + ' ' + b.from_time),
                'minutes'
              ) /
                30) *
                100 +
              '%',
            resources: b.resources,
            type: b.block_type,
            date: b.date,
          });
        });
      }
    }
    console.log(props.dateQ);
    console.log(blocks);
    setEvents(blocks);
    setIsdelete(false);
  }, [props.date, isdelete, props.s, resp]);

  {/* event delete request */}
  const toast = useToast();
  useEffect(() => {
    if (isdelete == true) {
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      myHeaders.append(
        'access-token',
        'MzQ6dGVzdE1haWxAZ21haWwuY29tOkFkbWluOjM4ZDkzN2YxLTU1MGUtNDFmNy1iZTZiLTg1OGNkNzVjNGE4ZQ=='
      );
      myHeaders.append('Access-Control-Allow-Origin', '*');

      var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow',
      };

      fetch(
        `http://pawsensetest2-env.eba-rtpxdxih.ap-south-1.elasticbeanstalk.com/api/block/${del_id}`,
        requestOptions
      )
        .then(response => response.json())
        .then(result => {setDel_response(result)})
        .catch(error => console.log('error', error));
    }

    if(del_response != null && del_response.success == true) {
      toast({
        title: `Event ${del_id} Deleted`,
        status: 'success',
        durstion: 10000,
        isClosable: true,
      })
    }
    setIsdelete(false);
  }, [isdelete, del_id]);

  return (
    <Box bg='white' w='100%'>
      {/* the date text*/}
      <Box display='flex' flexFlow='row wrap' ml='8' alignItems='center'>
        <Text
          display={props.isDaily ? 'block' : 'none'}
          fontSize={{ base: '40', sm: '50' }}
          fontWeight='semi-bold'
        >
          {props.date}
        </Text>
        <Text
          display={props.isDaily ? 'block' : 'none'}
          fontSize={{ base: '25', sm: '30' }}
          fontWeight='semi-bold'
          ml='2'
        >
          {props.day}
        </Text>
      </Box>
      {/* slot blocks */}
      {times.map(time => (
        <Box display='flex' flexDirection='row' h='12'>
          <Text
            display={
              props.isDaily ? 'block' : props.displayTime ? 'block' : 'none'
            }
            fontSize={props.displayTime ? '10' : '13'}
            fontWeight='semi-bold'
            align='start'
            minW={props.displayTime ? '20px' : '40px'}
            mt='-2'
          >
            {Math.floor(time)} :{' '}
            {(time - Math.floor(time)) * 60 == 0 ? '00' : '30'}
          </Text>
          <Box
            w='100%'
            h='100%'
            _hover={{ bg: 'blackAlpha.100' }}
            border='1px'
            borderBottom='0px'
            borderColor='#D9DDDC'
            display='flex'
            justifyContent='center'
          >
            {events.map(b => (
              <Box
                w={{ base: '20%', md: '80%' }}
                //minW={{base: '0', md: '30%'}}
                mx='5px'
                h={b.h}
                display={
                  Math.floor(time) +
                    ':' +
                    ((time - Math.floor(time)) * 60 == 0 ? '00' : '30') ==
                  b.start
                    ? 'block'
                    : 'none'
                }
              >
                <Button
                  w='100%'
                  h='100%'
                  bg={b.type == 'BOOKING' ? '#DB4437' : '#0F9D58'}
                  _hover={{ bg: b.type == 'BOOKING' ? '#D21404' : '#028A0F' }}
                  borderTopWidth='20px'
                  borderColor='blackAlpha.700'
                >
                  <Eventdisplay
                    data={b}
                    setDelete={setIsdelete}
                    setDel_id={setDel_id}
                  />
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export function Weekly(props) {
  return (
    <Box ml='5px' mt='5px' mr='5px'>
      <Grid templateColumns='repeat(5, 1fr)' gap={0}>
        {props.week.map(wk => (
          <GridItem w='100%' bg='white'>
            <Box display='flex' flexFlow='column wrap'>
              <Box
                w='70px'
                onClick={e => {
                  props.setDaily(true);
                  props.setDate(wk.date);
                  props.setDay(wk.day);
                }}
                _hover={{ cursor: 'pointer' }}
              >
                <Text
                  fontSize={{ base: '30', sm: '45' }}
                  maxW={{ base: '41', sm: '65' }}
                  borderRadius='50'
                  bg={props.date_selected == wk.date ? '#4285F4' : 'white'}
                  _hover={{
                    bg:
                      props.date_selected == wk.date
                        ? '#2684FC'
                        : 'blackAlpha.200',
                  }}
                  align='center'
                >
                  {wk.date}
                </Text>
              </Box>
              <Text
                mt={{ base: '-3', sm: '-4' }}
                ml='1'
                fontSize={{ base: '12', sm: '15' }}
                h='30'
              >
                {wk.day}
              </Text>
            </Box>
            <Daily
              dateQ={wk.dateQ}
              date={wk.date}
              day={wk.day}
              displayTime={wk.day == 'Monday' ? true : false}
              isDaily={false}
              s={props.date_selected}
            />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
