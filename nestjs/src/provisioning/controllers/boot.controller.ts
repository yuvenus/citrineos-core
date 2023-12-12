import { Controller, Get, HttpStatus, SerializeOptions } from '@nestjs/common';
import { CONTROLLER } from '../../modules/common/common.module';
import { ApiConsumes, ApiImplicitParam, ApiModelProperty, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';

@ApiUseTags(CONTROLLER.BOOT)
@Controller(CONTROLLER.BOOT)
// @UseGuards(AuthGuard(JWT_STRATEGY_NAME)) // todo auth
export class BootController {
  // todo compodoc

  /**
   * @param orderService
   * @param appLogService
   */
  constructor() {} // private bootService: BootService, todo service

  /**
   * Get todo
   * @param some - todo
   * @returns other todo
   */
  @Get()
  // @SerializeOptions({ // todo similar to JsonViews in Jackson
  //   groups: [GROUP.ORDER_SUMMARY]
  // })
  @ApiOperation({
    summary: 'getOrders',
    description:
      'Get orders for provided test centers, and orders for provided user (if isOwn is true), and favorite orders (if favorites is true)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order summary list is returned to user',
    // type: POJO, todo
    isArray: true,
  })
  @ApiImplicitParam({ name: 'param', description: 'Test center list', type: POJO, required: true })
  getOrders(
    @User(JwtUserKeys.STAFF_NO) userStaffNo: string,
    @Query() param: TestCenterDto,
    @Query('isOwn') isOwn: boolean = false,
    @Query('favorites') favorites: boolean = false,
    @Query('includeTasks') includeTasks: boolean = false,
    @Page() pageable: Pageable,
  ): Promise<ORDERS[]> {
    this.appLogService.debug('[OrderController] - getOrders', userStaffNo, param, isOwn, favorites, includeTasks);
    return this.orderService.getOrders(userStaffNo, param.testCenters, pageable, isOwn, favorites, includeTasks);
  }
}
